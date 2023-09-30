export const metadata = {
  title: 'Resume Builder',
  description: 'Automatically build a resume from a job description.',
}

import Hero from '@/components/hero'
import UploadArea from '@/components/upload'

export default function Home() {

  return (
    <>
      <Hero />
      <div id='upload_section'>
       <UploadArea />
      </div>
    </>
  )
}
