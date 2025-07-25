type Props = {
  html: string
}

export function Code({ html }: Props) {
  return <div dangerouslySetInnerHTML={{ __html: html }}></div>
}
