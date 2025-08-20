import Image from 'next/image'
import React from 'react'

interface EventType {
  id: number;
  title: string;
  description: string;
  image: string;
}

const Event = () => {
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
      title: "Food & Wine Expo",
      description: "A culinary journey with the finest food and wines.",
      image: "/image/food-wine-expo.png"
    },
    {
      id: 4,
      title: "Food & Wine Expo",
      description: "A culinary journey with the finest food and wines.",
      image: "/image/food-wine-expo.png"
    },
    {
      id: 5,
      title: "Food & Wine Expo",
      description: "A culinary journey with the finest food and wines.",
      image: "/image/food-wine-expo.png"
    },
    {
      id: 6,
      title: "Food & Wine Expo",
      description: "A culinary journey with the finest food and wines.",
      image: "/image/food-wine-expo.png"
    },
  ];
  return (
    <div className="w-full">

      {/* Popular Events */}
      <div>
        <h1 className='text-[22px] font-bold mb-2'>Popular Event</h1>
        
        {/* Grid layout for responsive design */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 p-4 lg:p-[16px]'>
          {events.map((event) => (
            <article key={event.id} className='flex flex-col gap-4 min-w-0'>
              <div className='relative w-full aspect-[272/169] overflow-hidden rounded-lg'>
                <Image 
                  src={event.image}
                  alt={event.title}
                  fill
                  className='object-cover'
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>
              <div className='flex flex-col'>
                <h2 className='text-[16px] font-medium line-clamp-2'>{event.title}</h2>
                <p className='text-[14px] font-normal text-[#61758A] line-clamp-2'>
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* My events */}
      <div className='mt-10'>
        <h1 className='text-[22px] font-bold mb-2'>My Events</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 p-4 lg:p-[16px]'>
          {myEvents.map((event) => (
            <article key={event.id} className='flex flex-col gap-4 min-w-0'>
              <div className='relative w-[176px] h-[99px] aspect-[272/169] overflow-hidden rounded-lg'>
                <Image 
                  src={event.image}
                  alt={event.title}
                  fill
                  className='object-cover'
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>
              <div className='flex flex-col'>
                <h2 className='text-[16px] font-medium line-clamp-2'>{event.title}</h2>
                <p className='text-[14px] font-normal text-[#61758A] line-clamp-2'>
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>
    </div>
    </div>
  )
}

export default Event