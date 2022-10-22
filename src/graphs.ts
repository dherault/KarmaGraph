import { GraphType } from './types'

const graphs: Record<string, GraphType> = {
  'Two individuals': {
    nodes: [
      {
        id: 'A',
        label: 'A',
        karma: {
          A: 4,
          B: 4,
        },
        being: 'A',
        psys: [
          {
            id: 'PsyA',
            cost: 1,
            composition: [],
            fun: (x: string, ...others) => [`${x}A`, ...others],
          },
        ],
      },
      {
        id: 'B',
        label: 'B',
        karma: {
          B: 4,
          A: 4,
        },
        being: 'B',
        psys: [
          {
            id: 'PsyB',
            cost: 1,
            composition: [],
            fun: (x: string, ...others) => [`${x}B`, ...others],
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
          A: 4,
          B: 2,
          C: 2,
        },
        being: 'A',
        psys: [
          {
            id: 'PsyA',
            cost: 1,
            composition: [],
            fun: (x: string, ...others) => [`${x}A`, ...others],
          },
        ],
      },
      {
        id: 'B',
        label: 'B',
        karma: {
          A: 2,
          B: 4,
          C: 2,
        },
        being: 'B',
        psys: [
          {
            id: 'PsyB',
            cost: 1,
            composition: [],
            fun: (x: string, ...others) => [`${x}B`, ...others],
          },
        ],
      },
      {
        id: 'C',
        label: 'C',
        karma: {
          A: 2,
          B: 2,
          C: 4,
        },
        being: 'C',
        psys: [
          {
            id: 'PsyC',
            cost: 1,
            composition: [],
            fun: (x: string, ...others) => [`${x}C`, ...others],
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
          A: 4,
          B: 2,
          C: 2,
        },
        being: 'A',
        psys: [
          {
            id: 'PsyA',
            cost: 1,
            composition: ['B:PsyB'],
            fun: (x: string, ...others) => [`${x}A`, ...others],
          },
        ],
      },
      {
        id: 'B',
        label: 'B',
        karma: {
          A: 2,
          B: 4,
          C: 2,
        },
        being: 'B',
        psys: [
          {
            id: 'PsyB',
            cost: 1,
            composition: ['C:PsyC'],
            fun: (x: string, ...others) => [`${x}B`, ...others],
          },
        ],
      },
      {
        id: 'C',
        label: 'C',
        karma: {
          A: 2,
          B: 2,
          C: 4,
        },
        being: 'C',
        psys: [
          {
            id: 'PsyC',
            cost: 1,
            composition: [],
            fun: (x: string, ...others) => [`${x}C`, ...others],
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
          A: 4,
          B: 2,
          C: 2,
        },
        being: 'A',
        psys: [
          {
            id: 'PsyA',
            cost: 1,
            composition: ['B:PsyB'],
            fun: (x: string, ...others) => [`${x}A`, ...others],
          },
        ],
      },
      {
        id: 'B',
        label: 'B',
        karma: {
          A: 2,
          B: 4,
          C: 2,
        },
        being: 'B',
        psys: [
          {
            id: 'PsyB',
            cost: 1,
            composition: ['C:PsyC1', 'C:PsyC2'],
            fun: (x: string, ...others) => [`${x}B`, ...others],
          },
        ],
      },
      {
        id: 'C',
        label: 'C',
        karma: {
          A: 2,
          B: 2,
          C: 4,
        },
        being: 'C',
        psys: [
          {
            id: 'PsyC1',
            cost: 1,
            composition: [],
            fun: (x: string, ...others) => [`${x}C1`, ...others],
          },
          {
            id: 'PsyC2',
            cost: 1,
            composition: [],
            fun: (x: string, ...others) => [`${x}C2`, ...others],
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
          A: 4,
          B: 2,
          C: 2,
        },
        being: 'A',
        psys: [
          {
            id: 'PsyA',
            cost: 1,
            composition: [],
            fun: (x: string, ...others) => [`${x}A`, ...others],
          },
        ],
      },
      {
        id: 'B',
        label: 'B',
        karma: {
          A: 2,
          B: 4,
          C: 2,
        },
        being: 'B',
        psys: [
          {
            id: 'PsyB',
            cost: 1,
            composition: [],
            fun: (x: string, ...others) => [`${x}B`, ...others],
          },
        ],
      },
      {
        id: 'C',
        label: 'C',
        karma: {
          A: 2,
          B: 2,
          C: 4,
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
