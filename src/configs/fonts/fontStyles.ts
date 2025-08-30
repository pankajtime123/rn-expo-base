export type FontFamily = 'helvetica' 

export type FontWeight =
  | 'black'
  | 'bold'
  | 'extraBold'
  | 'hairline'
  | 'light'
  | 'medium'
  | 'thin'
  | 'wideDark'
  | 'regular'
  | 'palaroid'

export type FontSize = 8 | 10 | 12 | 14 | 16 | 18 | 20 | 24 | 32 | 38 | 40 | 48 | 72;

export interface TypographyStyle {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  color: string;
}

export const FONT_FAMILIES: Record<FontFamily, Record<FontWeight, string>> = {
  helvetica: {
    black: 'HelveticaNowDisplay-Black',
    bold: 'HelveticaNowDisplay-Bold',
    extraBold: 'HelveticaNowDisplay-ExtraBold',
    hairline: 'HelveticaNowDisplay-Hairline',
    light: 'HelveticaNowDisplay-Light',
    medium: 'HelveticaNowDisplay-Medium',
    thin: 'HelveticaNowDisplay-Thin',
    regular:"HelveticaNowDisplay-Regular",
    wideDark: '',
    palaroid:''
  }
};

const CUSTOM_LINE_HEIGHTS: Record<FontFamily, Record<FontSize, number>> = {
  helvetica: {
    8: 10,
    10: 12,
    12: 14,
    14: 16,
    16: 18,
    18: 20,
    20: 22,
    24: 28,
    32: 40,
    38: 38,
    40: 48,
    48: 56,
    72: 80,
  }
};

function createTypographyStyle(fontFamily: string, fontSize: number, lineHeight: number, color: string = '#FFFFFF'): TypographyStyle {
  return { fontFamily, fontSize, lineHeight, color };
}

type FontStyleKey<Family extends FontFamily, Weight extends FontWeight, Size extends FontSize> =
  `${Family}${Capitalize<Weight>}${Size}px`;

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateFontStyles(
  fontFamily: FontFamily,
  fontSizes: FontSize[]
): Record<FontStyleKey<FontFamily, FontWeight, FontSize>, TypographyStyle> {
  const styles: Record<string, TypographyStyle> = {};

  fontSizes.forEach((size) => {
    const sizeKey = `${size}px`;

    Object.keys(FONT_FAMILIES[fontFamily]).forEach((weight) => {
      const weightKey = weight as FontWeight;

      const styleKey = `${fontFamily}${capitalizeFirstLetter(weightKey)}${sizeKey}` as FontStyleKey<FontFamily, FontWeight, FontSize>;
      const lineHeight = CUSTOM_LINE_HEIGHTS[fontFamily][size] || (size + size * 0.5);

      styles[styleKey] = createTypographyStyle(
        FONT_FAMILIES[fontFamily][weightKey],
        size,
        lineHeight,
        '#FFFFFF'
      );
    });
  });

  return styles as Record<FontStyleKey<FontFamily, FontWeight, FontSize>, TypographyStyle>;
}

const fontSizes: FontSize[] = [8, 10, 12, 14, 16, 18, 20, 24, 32, 38, 40, 48, 72];

export const fontStyles = {
  ...generateFontStyles('helvetica', fontSizes),
} as const;

export type FontStylesType = keyof typeof fontStyles;



// | Font Name                        | Typical Weight Value                                   |
// | -------------------------------- | ------------------------------------------------------ |
// | `HelveticaNowDisplay-Black`      | **900**                                                |
// | `HelveticaNowDisplay-Bold`       | **700**                                                |
// | `HelveticaNowDisplay-ExtraBold`  | **800**                                                |
// | `HelveticaNowDisplay-Hairline`   | **100**                                                |
// | `HelveticaNowDisplay-Light`      | **300**                                                |
// | `HelveticaNowDisplay-Medium`     | **500**                                                |
// | `HelveticaNowDisplay-Thin`       | **200**                                                |
// | `wideDark` (empty / unspecified) | — depends on actual font file, usually **700** if bold |
