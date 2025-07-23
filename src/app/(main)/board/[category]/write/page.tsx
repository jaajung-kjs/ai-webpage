import { WriteForm } from "@/components/board/write-form"

const categoryNames = {
  notice: "공지사항",
  study: "학습자료",
  free: "자유게시판",
  photo: "사진 게시판",
}

export default async function WritePage({
  params,
}: {
  params: Promise<{ category: keyof typeof categoryNames }>
}) {
  const { category } = await params

  return <WriteForm category={category} categoryName={categoryNames[category]} />
}