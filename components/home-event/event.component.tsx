"use client"

import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react'

interface EventType {
  id: number;
  title: string;
  description: string;
  image: string;
}

const Event = () => {
  const popularEventsRef = useRef<HTMLDivElement>(null);
  const myEventsRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeCarousel, setActiveCarousel] = useState<'popular' | 'my' | null>(null);

  const events: EventType[] = [
    {
      id: 1,
      title: "Live Music Festival",
      description: "Experience the energy of live music with top artists.",
      image: "/image/live-music.png"
    },
    {
      id: 2,
      title: "Contemporary Art Showcase",
      description: "Discover groundbreaking art from emerging and established artists.",
      image: "/image/contemporary.png"
    },
    {
      id: 3,
      title: "Premier League Soccer Match",
      description: "Witness the thrill of a top-tier soccer game live.",
      image: "/image/premier.png"
    },
    {
      id: 4,
      title: "Art Gallery Opening",
      description: "Explore contemporary art from emerging local artists.",
      image: "/image/live-music.png"
    },
    {
      id: 5,
      title: "Jazz Night",
      description: "An intimate evening of smooth jazz and cocktails.",
      image: "/image/contemporary.png"
    },
    {
      id: 6,
      title: "Food Festival",
      description: "Taste cuisines from around the world.",
      image: "/image/premier.png"
    },
    {
      id: 7,
      title: "Comedy Show",
      description: "Laugh the night away with top comedians.",
      image: "/image/live-music.png"
    }
  ];

  const myEvents: EventType[] = [
    {
      id: 1,
      title: "Tech Conference 2024",
      description: "Innovation and networking in the tech industry.",
      image: "/image/tech-conference.png"
    },
    {
      id: 2,
      title: "Food & Wine Expo",
      description: "A culinary journey with the finest food and wines.",
      image: "/image/food-wine-expo.png"
    },
    {
      id: 3,
      title: "Design Workshop",
      description: "Learn the latest design trends and techniques.",
      image: "/image/food-wine-expo.png"
    },
    {
      id: 4,
      title: "Marketing Summit",
      description: "Digital marketing strategies for modern businesses.",
      image: "/image/food-wine-expo.png"
    },
    {
      id: 5,
      title: "Startup Meetup",
      description: "Connect with fellow entrepreneurs and investors.",
      image: "/image/food-wine-expo.png"
    },
    {
      id: 6,
      title: "Photography Class",
      description: "Master the art of digital photography.",
      image: "/image/food-wine-expo.png"
    },
    {
      id: 7,
      title: "Yoga Retreat",
      description: "Find inner peace and physical wellness.",
      image: "/image/tech-conference.png"
    },
    {
      id: 8,
      title: "Book Club Meeting",
      description: "Discuss this month's featured novel.",
      image: "/image/food-wine-expo.png"
    }
  ];

  const handleMouseDown = (e: React.MouseEvent, carouselType: 'popular' | 'my') => {
    setIsDragging(true);
    setActiveCarousel(carouselType);
    setStartX(e.pageX);
    
    const carousel = carouselType === 'popular' ? popularEventsRef.current : myEventsRef.current;
    if (carousel) {
      setScrollLeft(carousel.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !activeCarousel) return;
    
    e.preventDefault();
    const carousel = activeCarousel === 'popular' ? popularEventsRef.current : myEventsRef.current;
    if (!carousel) return;
    
    const x = e.pageX;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    carousel.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveCarousel(null);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setActiveCarousel(null);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent, carouselType: 'popular' | 'my') => {
    setIsDragging(true);
    setActiveCarousel(carouselType);
    setStartX(e.touches[0].pageX);
    
    const carousel = carouselType === 'popular' ? popularEventsRef.current : myEventsRef.current;
    if (carousel) {
      setScrollLeft(carousel.scrollLeft);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !activeCarousel) return;
    
    const carousel = activeCarousel === 'popular' ? popularEventsRef.current : myEventsRef.current;
    if (!carousel) return;
    
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setActiveCarousel(null);
  };

  return (
    <div className="w-full max-w-[1050px] mx-auto overflow-hidden">
      {/* Popular Events */}
      <div className="px-4">
        <h1 className='text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4'>Popular Event</h1>
        
        <div 
          ref={popularEventsRef}
          className='flex gap-3 md:gap-4 lg:gap-6 py-2 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing pl-0 pr-4'
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onMouseDown={(e) => handleMouseDown(e, 'popular')}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={(e) => handleTouchStart(e, 'popular')}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {events.map((event, index) => (
            <article 
              key={event.id} 
              className={`flex flex-col gap-3 md:gap-4 flex-shrink-0 w-60 sm:w-64 md:w-72 lg:w-80 ${index === events.length - 1 ? 'mr-4' : ''}`}
              style={{ userSelect: 'none' }}
            >
              <div className='relative w-full aspect-[16/10] overflow-hidden rounded-lg'>
                <Image 
                  src={event.image}
                  alt={event.title}
                  fill
                  className='object-cover pointer-events-none'
                  sizes="(max-width: 640px) 240px, (max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                  draggable={false}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <h2 className='text-[16px] font-medium line-clamp-2 leading-tight'>{event.title}</h2>
                <p className='text-[14px] font-normal text-[#61758A] line-clamp-2 leading-relaxed'>
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* My events */}
      <div className='mt-8 md:mt-10 lg:mt-12 px-4'>
        <h1 className='text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4'>My Events</h1>
        
        <div 
          ref={myEventsRef}
          className='flex gap-3 md:gap-4 lg:gap-6 py-2 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing pl-0 pr-4'
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onMouseDown={(e) => handleMouseDown(e, 'my')}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={(e) => handleTouchStart(e, 'my')}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {myEvents.map((event, index) => (
            <article 
              key={event.id} 
              className={`flex flex-col gap-2 md:gap-3 flex-shrink-0 w-36 sm:w-40 md:w-44 lg:w-48 ${index === myEvents.length - 1 ? 'mr-4' : ''}`}
              style={{ userSelect: 'none' }}
            >
              <div className='relative w-full aspect-[16/9] overflow-hidden rounded-lg'>
                <Image 
                  src={event.image}
                  alt={event.title}
                  fill
                  className='object-cover pointer-events-none'
                  sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, (max-width: 1024px) 176px, 192px"
                  draggable={false}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <h2 className='text-xs sm:text-sm md:text-base font-medium line-clamp-2 leading-tight'>{event.title}</h2>
                <p className='text-xs md:text-sm font-normal text-[#61758A] line-clamp-2 leading-relaxed'>
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Event;