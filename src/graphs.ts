import { GraphType } from './types'

const graphs: Record<string, GraphType> = {
  'Two individuals': {
    nodes: [
      {
        id: 'A',
        label: 'A',
        karma: {
          A: 16,
          B: 16,
        },
        being: 'A',
        psys: [
          {
            id: 'PsyA',
            cost: 1,
            composition: [],
            fun: (x: string) => `${x}A`,
          },
        ],
      },
      {
        id: 'B',
        label: 'B',
        karma: {
          B: 16,
          A: 16,
        },
        being: 'B',
        psys: [
          {
            id: 'PsyB',
            cost: 1,
            composition: [],
            fun: (x: string) => `${x}B`,
          },
        ],
      },
    ],
    edges: [
      {
        id: '1',
        from: 'A',
        to: 'B',
      },
      {
        id: '2',
        from: 'B',
        to: 'A',
      },
    ],
  },
  'Three individuals': {
    nodes: [
      {
        id: 'A',
        label: 'A',
        karma: {
          A: 16,
          B: 8,
          C: 8,
        },
        being: 'A',
        psys: [
          {
            id: 'PsyA',
            cost: 1,
            composition: [],
            fun: (x: string) => `${x}A`,
          },
        ],
      },
      {
        id: 'B',
        label: 'B',
        karma: {
          A: 8,
          B: 16,
          C: 8,
        },
        being: 'B',
        psys: [
          {
            id: 'PsyB',
            cost: 1,
            composition: [],
            fun: (x: string) => `${x}B`,
          },
        ],
      },
      {
        id: 'C',
        label: 'C',
        karma: {
          A: 8,
          B: 8,
          C: 16,
        },
        being: 'C',
        psys: [
          {
            id: 'PsyC',
            cost: 1,
            composition: [],
            fun: (x: string) => `${x}C`,
          },
        ],
      },
    ],
    edges: [
      {
        id: '1',
        from: 'A',
        to: 'B',
      },
      {
        id: '2',
        from: 'B',
        to: 'A',
      },
      {
        id: '3',
        from: 'B',
        to: 'C',
      },
      {
        id: '4',
        from: 'C',
        to: 'B',
      },
      {
        id: '5',
        from: 'A',
        to: 'C',
      },
      {
        id: '6',
        from: 'C',
        to: 'A',
      },
    ],
  },
  'Tower of three': {
    nodes: [
      {
        id: 'A',
        label: 'A',
        karma: {
          A: 16,
          B: 8,
          C: 8,
        },
        being: 'A',
        psys: [
          {
            id: 'PsyA',
            cost: 1,
            composition: ['B:PsyB'],
            fun: (x: string) => `${x}A`,
          },
        ],
      },
      {
        id: 'B',
        label: 'B',
        karma: {
          A: 8,
          B: 16,
          C: 8,
        },
        being: 'B',
        psys: [
          {
            id: 'PsyB',
            cost: 1,
            composition: ['C:PsyC'],
            fun: (x: string) => `${x}B`,
          },
        ],
      },
      {
        id: 'C',
        label: 'C',
        karma: {
          A: 8,
          B: 8,
          C: 16,
        },
        being: 'C',
        psys: [
          {
            id: 'PsyC',
            cost: 1,
            composition: [],
            fun: (x: string) => `${x}C`,
          },
        ],
      },
    ],
    edges: [
      {
        id: '1',
        from: 'A',
        to: 'B',
      },
      {
        id: '2',
        from: 'B',
        to: 'A',
      },
      {
        id: '3',
        from: 'B',
        to: 'C',
      },
      {
        id: '4',
        from: 'C',
        to: 'B',
      },
    ],
  },
  'Tower of three dual C': {
    nodes: [
      {
        id: 'A',
        label: 'A',
        karma: {
          A: 16,
          B: 8,
          C: 8,
        },
        being: 'A',
        psys: [
          {
            id: 'PsyA',
            cost: 1,
            composition: ['B:PsyB'],
            fun: (x: string) => `${x}A`,
          },
        ],
      },
      {
        id: 'B',
        label: 'B',
        karma: {
          A: 8,
          B: 16,
          C: 8,
        },
        being: 'B',
        psys: [
          {
            id: 'PsyB',
            cost: 1,
            composition: ['C:PsyC1', 'C:PsyC2'],
            fun: (x: string) => `${x}B`,
          },
        ],
      },
      {
        id: 'C',
        label: 'C',
        karma: {
          A: 8,
          B: 8,
          C: 16,
        },
        being: 'C',
        psys: [
          {
            id: 'PsyC1',
            cost: 1,
            composition: [],
            fun: (x: string) => `${x}C1`,
          },
          {
            id: 'PsyC2',
            cost: 1,
            composition: [],
            fun: (x: string) => `${x}C2`,
          },
        ],
      },
    ],
    edges: [
      {
        id: '1',
        from: 'A',
        to: 'B',
      },
      {
        id: '2',
        from: 'B',
        to: 'A',
      },
      {
        id: '3',
        from: 'B',
        to: 'C',
      },
      {
        id: '4',
        from: 'C',
        to: 'B',
      },
    ],
  },
  'Simple 3rd party': {
    nodes: [
      {
        id: 'A',
        label: 'A',
        karma: {
          A: 16,
          B: 8,
          C: 8,
        },
        being: 'A',
        psys: [
          {
            id: 'PsyA',
            cost: 1,
            composition: [],
            fun: (x: string) => `${x}A`,
          },
        ],
      },
      {
        id: 'B',
        label: 'B',
        karma: {
          A: 8,
          B: 16,
          C: 8,
        },
        being: 'B',
        psys: [
          {
            id: 'PsyB',
            cost: 1,
            composition: [],
            fun: (x: string) => `${x}B`,
          },
        ],
      },
      {
        id: 'C',
        label: 'C',
        karma: {
          A: 8,
          B: 8,
          C: 16,
        },
        being: 'C',
        psys: [],
      },
    ],
    edges: [
      {
        id: '1',
        from: 'A',
        to: 'B',
      },
      {
        id: '2',
        from: 'B',
        to: 'A',
      },
    ],
  },
}

export default graphs
