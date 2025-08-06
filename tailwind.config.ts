import { withAccountKitUi, createColorSet } from "@account-kit/react/tailwind";

export default withAccountKitUi({
  // Empty config for Tailwind v4 as most options are configured via CSS
}, {
  colors: {
    "btn-primary": createColorSet("#E82594", "#FF66CC"),
    "fg-accent-brand": createColorSet("#E82594", "#FF66CC"),
  },
  borderRadius: "md",
})