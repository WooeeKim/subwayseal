import label1 from '../assets/figma/label-1.svg'
import label2 from '../assets/figma/label-2.svg'
import label3 from '../assets/figma/label-3.svg'
import label4 from '../assets/figma/label-4.svg'
import label5 from '../assets/figma/label-5.svg'
import label6 from '../assets/figma/label-6.svg'

// 라벨 = 스티커북 한 권. Figma 에서 스티커북 라벨(#C2B18C)과 꾸미기 기본 선택 라벨이 4번으로 같다.
export const LABELS = [
  { id: 1, src: label1 },
  { id: 2, src: label2 },
  { id: 3, src: label3 },
  { id: 4, src: label4 },
  { id: 5, src: label5 },
  { id: 6, src: label6 },
]

export const DEFAULT_LABEL = 4

export function labelSrc(id: number) {
  return LABELS.find((l) => l.id === id)!.src
}
