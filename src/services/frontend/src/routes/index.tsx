import { createFileRoute } from '@tanstack/react-router'

import { Header } from '#/components/Header'
import { ImageCarousel } from '#/components/Landing/ImageCarousel'
import { KeyDates } from '#/components/Landing/KeyDates'
import { SearchBox } from '#/components/Landing/SearchBox'
import { Participation } from '#/components/Landing/Participation'
import { FreeParticipation } from '#/components/Landing/FreeParticipation'
import { Allies } from '#/components/Landing/Allies'
import { Footer } from '#/components/Footer'

export const Route = createFileRoute('/')({
  component: Landing,
})

function Landing() {
  return (
    <>
      <Header />
      <main>
        <ImageCarousel />
        <KeyDates />
        <SearchBox />
        <Participation />
        <FreeParticipation />
        <Allies />
      </main>
        <Footer/>
    </>
  )
}