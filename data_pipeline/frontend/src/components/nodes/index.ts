import BaseNode from './BaseNode'

export const nodeTypes = {
  python: BaseNode,
  data: BaseNode,
  save: BaseNode,
} as const

export { BaseNode }
export default nodeTypes
