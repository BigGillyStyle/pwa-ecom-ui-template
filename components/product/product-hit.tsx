import { useCallback } from 'react'
import type { WrappedInsightsClient } from 'react-instantsearch-core'
import { Highlight, Snippet } from 'react-instantsearch-dom'

import type { HitComponentProps } from '@instantsearch/widgets/infinite-hits/infinite-hits'

import type { ProductCardProps } from './product-card'
import { ProductCard } from './product-card'
import type { ProductTagType } from './product-tag'

export type ProductHitProps = HitComponentProps & {
  insights?: WrappedInsightsClient
  insightsEventName?: string
  highlighting?: boolean
}

export type ProductCardHitProps = ProductCardProps & {
  objectID: string
}

export function ProductHit({
  hit,
  insights,
  insightsEventName = 'PLP: Product Clicked',
  viewMode,
  highlighting = true,
}: ProductHitProps) {
  const product: ProductCardHitProps = {
    objectID: hit.objectID,
    url: `/${hit.url}`,
    image: hit.image_link,
    tags: [],
    label: hit.category,
    title: hit.name,
    description: hit.description,
    descriptionSnippeting() {
      return <Snippet attribute="description" tagName="mark" hit={hit} />
    },
    colors: [],
    price: parseInt(hit.newPrice ?? hit.price, 10),
    originalPrice: hit.newPrice ? parseInt(hit.price, 10) : undefined,
    rating: parseInt(hit.reviewScore, 10),
    reviews: parseInt(hit.reviewCount, 10),
    available: Boolean(hit.fullStock),
  }

  if (highlighting) {
    product.labelHighlighting = () => (
      <Highlight attribute="category" tagName="mark" hit={hit} />
    )

    product.titleHighlighting = () => (
      <Highlight attribute="name" tagName="mark" hit={hit} />
    )
  }

  if (product.reviews && product.reviews >= 50) {
    product.tags?.push({
      label: 'popular',
      theme: 'popular',
    } as ProductTagType)
  }

  if (!hit.fullStock) {
    product.tags?.push({
      label: 'out of stock',
      theme: 'out-of-stock',
    } as ProductTagType)
  }

  if (hit.hexColorCode) {
    product.colors?.push(hit.hexColorCode.split('//')[1])
  }

  const handleLinkClick = useCallback(() => {
    if (typeof insights === 'function') {
      insights('clickedObjectIDsAfterSearch', {
        eventName: insightsEventName,
      })
    }
  }, [insights, insightsEventName])

  return (
    <ProductCard view={viewMode} onLinkClick={handleLinkClick} {...product} />
  )
}

export function ProductHitShowcase(props: ProductHitProps) {
  return (
    <ProductHit
      {...props}
      highlighting={false}
      insightsEventName="Showcase: Product Clicked"
    />
  )
}
