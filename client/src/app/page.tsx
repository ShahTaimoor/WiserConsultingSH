import type { Metadata } from 'next'
import SoftwareConsulting from '@/components/SoftwareConsulting'
import JsonLd from '@/components/seo/JsonLd'
import { founderSchema, localBusinessSchema, pageMetadata, SITE } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: `${SITE.name} — Software House in Peshawar, Pakistan`,
  description:
    'Software house in Peshawar building custom software, e-commerce platforms, business websites, mobile apps and POS systems for growing businesses. Request a free consultation.',
  path: '/',
})

const page = () => {
  return (
    <>
      <JsonLd data={[localBusinessSchema(), founderSchema()]} />
      <SoftwareConsulting />
    </>
  )
}

export default page
