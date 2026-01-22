import { type SchemaTypeDefinition } from 'sanity'

import { productType } from './productType'
import { applicationType } from './applicationType'
import { mainCategory } from './mainCategory'
import { subCategory } from './subCategory'
import { systemType } from './systemType'
import { variant } from './variant'
import { homePage } from './homePage'
import { newTechnologyItem } from './newTechnologyItem'
import { trustedByItem } from './trustedByItem'
import { testimonial } from './testimonial'
import { leader } from './leader'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // New Strict Hierarchy
    applicationType, // Added
    mainCategory,
    subCategory,
    systemType,
    variant,
    productType, // Updated
    homePage,
    newTechnologyItem, // Added
    trustedByItem,
    testimonial,
    leader
  ],
}
