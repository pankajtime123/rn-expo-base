

import { RootStackScreens } from "@/src/navigation/RootStack/types";
import { getDeviceId } from "@/src/utils/deviceUtils";
import { navigate, resetAndNavigate } from "@/src/utils/NavigationUtils";
import { storage } from "@/src/utils/storage";
import { action, makeAutoObservable, observable, runInAction } from "mobx";
import { TextInput } from "react-native";
import { requestHint } from 'react-native-otp-verify';
import type { RootStoreType } from "../../RootStore";

const MAX_OTP_ATTEMPTS = 3;
const ATTEMPT_RESET_SECONDS = 60;

export class LoginStore {
  rootStore: RootStoreType;

  @observable isLoading: boolean = false;
  @observable error: string | null = null;
  @observable isAuthenticated: boolean = false;

  // Auth flow state
  @observable phone: string = "";
  @observable otp: string = "";
  @observable otpError: string = "";
  @observable referralCode: string = "";
  @observable referralCodeError: string = "";
  @observable isReferralCodeApplied: boolean = false;
  @observable resendTime: number = 10;

  constructor(rootStore: RootStoreType) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  // --- Phone ---
  @action
  setPhone(phone: string) {
    this.phone = phone;
    this.error = null;
  }

  @action
  setOtp(otp: string[]) {
    this.otp = otp.join("");
  }

  // Handle OTP input focus
  handleOtpInput(index: number, inputRefs: React.RefObject<TextInput[]>) {
    inputRefs.current[index].setSelection(1, 1);

    if (index > 0 && !this.otp?.[index - 1]) {
      const emptyIndex = this.otp?.indexOf('');
      if (emptyIndex !== -1 && inputRefs.current?.[emptyIndex]) {
        inputRefs?.current?.[emptyIndex]?.focus();
      }
    }
  }


  @action
  clearPhone() {
    this.phone = "";
    this.error = null;
  }

  // --- OTP ---
  OTP_ATTEMPT_KEY = () => `otp_attempts_${this.phone}`;
  OTP_ATTEMPT_TIMESTAMP_KEY = () => `otp_attempts_timestamp_${this.phone}`;

  @action
  getAttempts() {
    const lastAttemptTime = Number(storage.getNumber(this.OTP_ATTEMPT_TIMESTAMP_KEY())) || 0;
    const now = Math.floor(Date.now() / 1000);
    const secondsSinceLastAttempt = now - Math.floor(lastAttemptTime / 1000);

    if (lastAttemptTime > 0 && secondsSinceLastAttempt >= ATTEMPT_RESET_SECONDS) {
      this.resetAttempts();
      return 0;
    }
    return storage.getNumber(this.OTP_ATTEMPT_KEY()) || 0;
  }

  @action
  incrementAttempts() {
    const attempts = this.getAttempts() + 1;
    storage.set(this.OTP_ATTEMPT_KEY(), attempts);
    storage.set(this.OTP_ATTEMPT_TIMESTAMP_KEY(), Date.now());
    return attempts;
  }

  @action
  resetAttempts() {
    storage.delete(this.OTP_ATTEMPT_KEY());
    storage.delete(this.OTP_ATTEMPT_TIMESTAMP_KEY());
  }

  @action
  async callRequestOtp() {
    this.isLoading = true;
    this.error = null;
    try {
      const response = '' // await requestOtp({ phone: `+91${this.phone}` });
      this.startResendTimer();
      navigate("Otp");
    } catch (e: any) {
      runInAction(() => {
        this.error = e?.message || "Failed to request OTP";
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  @action
  async callVerifyOtp(otp: string) {
    if (this.getAttempts() >= MAX_OTP_ATTEMPTS) {
      this.otpError = "Attempts exhaused. Please try after sometime";
      return;
    }
    this.isLoading = true;
    this.otpError = "";
    try {
      const device_id = await getDeviceId()
      const res = {}
      // this.rootStore.authStore.setUser(res.data?.data)
      this.resetAttempts();
      this.isAuthenticated = true;
      console.error("ASDF", this.rootStore.authStore.authData)
      this.rootStore.authStore.authData?.is_new_user ? navigate(RootStackScreens.Referral) : resetAndNavigate(RootStackScreens.MainApp)
    } catch (e: any) {
      this.incrementAttempts();
      if (this.getAttempts() >= MAX_OTP_ATTEMPTS - 1) {
        this.otpError = "Attempts exhaused. Please try after sometime";
      } else {
        this.otpError = e?.message || "OTP verification failed";
      }
    } finally {
      this.isLoading = false;
    }
  }

  @action
  startResendTimer() {
    this.resendTime = 10;
    const timer = setInterval(() => {
      runInAction(() => {
        if (this.resendTime > 0) {
          this.resendTime -= 1;
        } else {
          clearInterval(timer);
        }
      });
    }, 1000);
  }

  handleLayout(hasShownHint: React.MutableRefObject<boolean>) {
    if (!hasShownHint.current) {
      hasShownHint.current = true;
      requestHint()
        .then(phoneNumber => {
          console.log('User selected phone number:', phoneNumber);
          const phoneWithoutCountryCode = phoneNumber.replace(/^\+\d{1,4}/, '');
          const phoneWithCountryCode = `${phoneWithoutCountryCode}`;
          this.setPhone(phoneWithCountryCode);
        })
        .catch(err => {
          console.log('Hint error or user cancelled:', err);
        });
    }
  };

  // --- Referral ---
  @action
  setReferralCode(code: string) {
    this.referralCode = code;
    if(this.referralCode === ''){
      this.referralCodeError = ''
    }
  }

  @action
  async callVerifyReferralCode() {
    this.isLoading = true;
    this.referralCodeError = "";
    try {
      const res = {}
      const result:any = ''  //res.data?.data

      if (result?.type === 'referral_code_not_found' && result.status === 404) {
        this.referralCodeError = result.message
      } else if (result?.status === 200) {
        this.isReferralCodeApplied = true
        // resetAndNavigate(RootStackScreens.MainApp)
      } else {
        this.referralCodeError = result?.message || ''
      }

    } catch (e: any) {
      this.referralCodeError = e?.message || "Referral code verification failed";
    } finally {
      this.isLoading = false;
    }
  }

  @action
  clearReferralCode() {
    this.referralCode = "";
    this.referralCodeError = "";
    this.isReferralCodeApplied = false;
  }

  // --- Logout ---
  @action
  async logout() {
    this.isAuthenticated = false;
    this.phone = "";
    this.otp = "";
    this.otpError = "";
    this.referralCode = "";
    this.referralCodeError = "";
    this.isReferralCodeApplied = false;
    this.error = null;
    this.isLoading = false;
  }
}