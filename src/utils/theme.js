import { statAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(statAnatomy.keys)

export const statTheme = defineMultiStyleConfig({
  sizes: {
    // define the styles for this size variant
    xs: definePartsStyle({
      label: { fontSize: "xs" },
      helpText: { fontSize: "xs" },
      number: { fontSize: "xs" },
    }),
  }
})

