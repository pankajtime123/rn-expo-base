

import { screenWidth } from '@/src/utils/resizing';
import React, { FC, useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';

type TCarouselItem = {id: number, title: string, description: string, color: string, image: string}

  const carouselData = [
    {
      id: 1,
      title: 'Slide 1',
      description: 'This is the first slide',
      color: '#FF6B6B',
      image: 'https://picsum.photos/300/200?random=1'
    },
    {
      id: 2,
      title: 'Slide 2',
      description: 'This is the second slide',
      color: '#4ECDC4',
      image: 'https://picsum.photos/300/200?random=2'
    },
    {
      id: 3,
      title: 'Slide 3',
      description: 'This is the third slide',
      color: '#45B7D1',
      image: 'https://picsum.photos/300/200?random=3'
    },
    {
      id: 4,
      title: 'Slide 4',
      description: 'This is the fourth slide',
      color: '#F7DC6F',
      image: 'https://picsum.photos/300/200?random=4'
    }
  ];




const HorizontalCircularCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(1)
    const scrollViewRef = useRef(null)
    const [isScrolling, setIsScrolling] = useState(false)
    const infiniteData = [carouselData[carouselData.length-1], ...carouselData, carouselData[0]]


  function handleScroll(e:NativeSyntheticEvent<NativeScrollEvent>){
       const offset = e.nativeEvent.contentOffset.x
       const index = Math.round(offset/screenWidth)
       setCurrentIndex(index)
  }

  useEffect(()=>{
       if(scrollViewRef.current){
         scrollViewRef.current.scrollTo({
      x: screenWidth,
        animated: false,
      });
       }
  },[])

  useEffect(()=>{
    let timer: ReturnType<typeof setInterval>
         timer = setInterval(()=>{
            if(!isScrolling){
                handleAutoScroll()
            }
         },1000)

    return ()=> clearInterval(timer)
  },[currentIndex, isScrolling])

  function handleAutoScroll(){
    if(scrollViewRef.current){
           const nextIndex = currentIndex+1
          scrollViewRef.current?.scrollTo({
            x: nextIndex * screenWidth, 
            animated: true
         })
    }  
  }

  function handleOnScrollBeginDrag(){
     setIsScrolling(true)
  }

  function handleOnScrollEndDrag(){
    setIsScrolling(false)
  }
    

    function handleMomentumScrollEnd(e:NativeSyntheticEvent<NativeScrollEvent>){
         const offset = e.nativeEvent.contentOffset.x
       const index = Math.round(offset/screenWidth)

       if(index === 0){
        scrollViewRef.current?.scrollTo({
            x:  carouselData.length * screenWidth, 
            animated: false
         })
         setCurrentIndex(carouselData.length)
       }else if(index === infiniteData.length -1 ){
         scrollViewRef.current?.scrollTo({
            x: screenWidth, 
            animated: false
         })
          setCurrentIndex(1)
       }

    }

    const getActiveIndex = ()=>{
        if(currentIndex === 0 ) return carouselData.length-1
        else if(currentIndex === infiniteData.length -1) return 0
        return currentIndex -1
    }
  return (
    <View style={[styles.container]}> 
    <ScrollView onScrollEndDrag={handleOnScrollEndDrag} onScrollBeginDrag={handleOnScrollBeginDrag} scrollEventThrottle={16} ref={scrollViewRef} onMomentumScrollEnd={handleMomentumScrollEnd} onScroll={handleScroll} showsHorizontalScrollIndicator={false} horizontal pagingEnabled style={[styles.scrollView]} contentContainerStyle={[styles.contentContainer]}>
      {infiniteData.map((item:TCarouselItem, index)=>{
        return <CarouselItem key={`${index}`} {...item} />
      })}
      
    </ScrollView>
      <View style={[styles.indicatorContainer]}>
     {carouselData.map((item, index)=>{
        return <View key={`${index}`} style={[styles.indicator, {backgroundColor: getActiveIndex()=== index ? 'blue': '#fff' }]} />
      })}
      </View>
   
    </View>
  )
}

export default HorizontalCircularCarousel

const CarouselItem:FC<TCarouselItem> = ({title,description,image, color})=>{
    return <View style={[styles.item, {backgroundColor: color}]} >
           <Text>
            {title}
           </Text>
        </View>
}


const styles = StyleSheet.create({
    scrollView:{
       flex: 1,
    },
    container:{backgroundColor: '#fff', height: 300}, 
    item:{
        width: screenWidth, 
        height: 300, 
        justifyContent: 'center', 
        alignItems:'center',
    }, 
    contentContainer:{
          justifyContent: 'center', 
          alignItems:'center',
    }, 
    image:{
        height:'100%', 
        width:'100%'
    }, 
    indicator:{
        height: 10, 
        width: 10, 
        borderRadius: 5, 
        backgroundColor: 'white',
    }, 
    indicatorContainer:{
        justifyContent:'center', 
        alignItems:'center', 
        flexDirection:'row', 
        gap: 10, 
        position:'absolute',
        left: screenWidth/2 - 35, 
        bottom: 20
    }
})




// import React, { useEffect, useRef, useState } from 'react';
// import {
//     Dimensions,
//     Image,
//     ScrollView,
//     StyleSheet,
//     Text,
//     View,
// } from 'react-native';

// const { width: screenWidth } = Dimensions.get('window');

// export const InfiniteCarousel = ({ data = [], autoPlay = false, autoPlayInterval = 3000 }) => {
//   const scrollViewRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(1); // Start from index 1 (first real item)
//   const [isScrolling, setIsScrolling] = useState(false);

//   // Create infinite data by adding clones at the beginning and end
//   const infiniteData = [
//     data[data.length - 1], // Clone of last item at the beginning
//     ...data,
//     data[0], // Clone of first item at the end
//   ];

//   useEffect(() => {
//     // Initially scroll to the first real item (index 1)
//     if (scrollViewRef.current && infiniteData.length > 0) {
//       scrollViewRef.current.scrollTo({
//         x: screenWidth,
//         animated: false,
//       });
//     }
//   }, []);

//   useEffect(() => {
//     if (autoPlay && data.length > 1) {
//       const interval = setInterval(() => {
//         if (!isScrolling) {
//           handleAutoScroll();
//         }
//       }, autoPlayInterval);

//       return () => clearInterval(interval);
//     }
//   }, [autoPlay, autoPlayInterval, currentIndex, isScrolling]);

//   const handleAutoScroll = () => {
//     if (scrollViewRef.current) {
//       const nextIndex = currentIndex + 1;
//       scrollViewRef.current.scrollTo({
//         x: nextIndex * screenWidth,
//         animated: true,
//       });
//     }
//   };

//   const handleScroll = (event) => {
//     const contentOffsetX = event.nativeEvent.contentOffset.x;
//     const index = Math.round(contentOffsetX / screenWidth);
    
//     setCurrentIndex(index);
//   };

//   const handleScrollBeginDrag = () => {
//     setIsScrolling(true);
//   };

//   const handleScrollEndDrag = () => {
//     setIsScrolling(false);
//   };

//   const handleMomentumScrollEnd = (event) => {
//     const contentOffsetX = event.nativeEvent.contentOffset.x;
//     const index = Math.round(contentOffsetX / screenWidth);

//     // Handle infinite scroll logic
//     if (index === 0) {
//       // If we're at the cloned last item (index 0), jump to the real last item
//       scrollViewRef.current.scrollTo({
//         x: data.length * screenWidth,
//         animated: false,
//       });
//       setCurrentIndex(data.length);
//     } else if (index === infiniteData.length - 1) {
//       // If we're at the cloned first item (last index), jump to the real first item
//       scrollViewRef.current.scrollTo({
//         x: screenWidth,
//         animated: false,
//       });
//       setCurrentIndex(1);
//     }
    
//     setIsScrolling(false);
//   };

//   const getIndicatorIndex = () => {
//     if (currentIndex === 0) return data.length - 1;
//     if (currentIndex === infiniteData.length - 1) return 0;
//     return currentIndex - 1;
//   };

//   const renderItem = (item, index) => (
//     <View key={index} style={styles.itemContainer}>
//       {item.image ? (
//         <Image source={{ uri: item.image }} style={styles.image} />
//       ) : (
//         <View style={[styles.placeholder, { backgroundColor: item.color || '#ddd' }]} />
//       )}
//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.description}>{item.description}</Text>
//     </View>
//   );

//   const renderIndicators = () => (
//     <View style={styles.indicatorContainer}>
//       {data.map((_, index) => (
//         <View
//           key={index}
//           style={[
//             styles.indicator,
//             getIndicatorIndex() === index && styles.activeIndicator,
//           ]}
//         />
//       ))}
//     </View>
//   );

//   if (!data.length) {
//     return (
//       <View style={styles.container}>
//         <Text>No data available</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         ref={scrollViewRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScroll={handleScroll}
//         onScrollBeginDrag={handleScrollBeginDrag}
//         onScrollEndDrag={handleScrollEndDrag}
//         onMomentumScrollEnd={handleMomentumScrollEnd}
//         scrollEventThrottle={16}
//         style={styles.scrollView}
//       >
//         {infiniteData.map((item, index) => renderItem(item, index))}
//       </ScrollView>
//       {renderIndicators()}
//     </View>
//   );
// };

// // Example usage component
// export const CarouselExample = () => {
//   const carouselData = [
//     {
//       id: 1,
//       title: 'Slide 1',
//       description: 'This is the first slide',
//       color: '#FF6B6B',
//       image: 'https://picsum.photos/300/200?random=1'
//     },
//     {
//       id: 2,
//       title: 'Slide 2',
//       description: 'This is the second slide',
//       color: '#4ECDC4',
//       image: 'https://picsum.photos/300/200?random=2'
//     },
//     {
//       id: 3,
//       title: 'Slide 3',
//       description: 'This is the third slide',
//       color: '#45B7D1',
//       image: 'https://picsum.photos/300/200?random=3'
//     },
//     {
//       id: 4,
//       title: 'Slide 4',
//       description: 'This is the fourth slide',
//       color: '#F7DC6F',
//       image: 'https://picsum.photos/300/200?random=4'
//     }
//   ];

//   return (
//     <View style={styles.exampleContainer}>
//       <Text style={styles.header}>Infinite Carousel Example</Text>
//       <InfiniteCarousel 
//         data={carouselData} 
//         autoPlay={true} 
//         autoPlayInterval={3000} 
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: 300,
//     backgroundColor: '#fff',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   itemContainer: {
//     width: screenWidth,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   image: {
//     width: screenWidth - 40,
//     height: 150,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   placeholder: {
//     width: screenWidth - 40,
//     height: 150,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     paddingHorizontal: 20,
//   },
//   indicatorContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 15,
//   },
//   indicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#ddd',
//     marginHorizontal: 4,
//   },
//   activeIndicator: {
//     backgroundColor: '#007AFF',
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//   },
//   exampleContainer: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     paddingTop: 50,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#333',
//   },
// });

// export default CarouselExample;