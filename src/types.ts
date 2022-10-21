export type NodeType = {
  id: string
  label: string
  karma: Record<string, number>
  being: string
  psys: PsyType[]
}

export type EdgeType = {
  id: string
  from: string
  to: string
}

export type GraphType = {
  nodes: NodeType[]
  edges: EdgeType[]
}

export type LedgerType = Record<string, number>

export type FunType = (being: string) => string

export type PsyType = {
  id: string
  cost: number
  composition: string[],
  fun: FunType
}

export type StepsType = {
  label: string
  from: string
  to: string
  psy: PsyType
  result: string
}[]
