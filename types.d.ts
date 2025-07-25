declare module '*.svg?url' {
  const svg: string
  export default svg
}

declare module '@splidejs/react-splide' {
  export { Options } from '@splidejs/splide'
  export { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide'
}
