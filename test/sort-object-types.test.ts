import { ESLintUtils } from '@typescript-eslint/utils'
import { describe, it } from 'vitest'
import { dedent } from 'ts-dedent'

import rule, { RULE_NAME } from '../rules/sort-object-types'
import { SortType, SortOrder } from '../typings'

describe(RULE_NAME, () => {
  let ruleTester = new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
  })

  describe(`${RULE_NAME}: sorting by alphabetical order`, () => {
    let type = 'alphabetical-order'

    it(`${RULE_NAME}(${type}): sorts type members`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              type Mushishi = {
                birthname: 'Yoki'
                name: 'Ginko'
                status: 'wanderer'
              }
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              type Mushishi = {
                name: 'Ginko'
                birthname: 'Yoki'
                status: 'wanderer'
              }
            `,
            output: dedent`
              type Mushishi = {
                birthname: 'Yoki'
                name: 'Ginko'
                status: 'wanderer'
              }
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'name',
                  second: 'birthname',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts type members in function args`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              let handleDemonSlayerAttack = (attack: {
                attackType: string
                demon: string
                slayerName: string
              }) => {
                // ...
              }
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              let handleDemonSlayerAttack = (attack: {
                slayerName: string
                attackType: string
                demon: string
              }) => {
                // ...
              }
            `,
            output: dedent`
              let handleDemonSlayerAttack = (attack: {
                attackType: string
                demon: string
                slayerName: string
              }) => {
                // ...
              }
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'slayerName',
                  second: 'attackType',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts type members with computed keys`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              type SquadMember = {
                [key: string]: string
                age?: 30
                name: 'Levi Ackermann'
                occupation: 'soldier'
                rank: 'captain'
                [residence]: 'Wall Rose'
              }
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              type SquadMember = {
                age?: 30
                [key: string]: string
                occupation: 'soldier'
                name: 'Levi Ackermann'
                [residence]: 'Wall Rose'
                rank: 'captain'
              }
            `,
            output: dedent`
              type SquadMember = {
                [key: string]: string
                age?: 30
                name: 'Levi Ackermann'
                occupation: 'soldier'
                rank: 'captain'
                [residence]: 'Wall Rose'
              }
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'age',
                  second: '[key: string]',
                },
              },
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'occupation',
                  second: 'name',
                },
              },
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'residence',
                  second: 'rank',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts type members with any key types`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              type ParanoiaAgent = {
                [...kills]
                [[data]]: string
                [name in victims]?
                [8]: Victim
                goldenBatAttack(): void
                hide?: () => void
              }
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              type ParanoiaAgent = {
                [...kills]
                [[data]]: string
                goldenBatAttack(): void
                [8]: Victim
                hide?: () => void
              }
            `,
            output: dedent`
              type ParanoiaAgent = {
                [...kills]
                [[data]]: string
                [8]: Victim
                goldenBatAttack(): void
                hide?: () => void
              }
            `,
            options: [
              {
                type: SortType.alphabetical,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'goldenBatAttack(): void',
                  second: '8',
                },
              },
            ],
          },
        ],
      })
    })
  })

  describe(`${RULE_NAME}: sorting by natural order`, () => {
    let type = 'natural-order'

    it(`${RULE_NAME}(${type}): sorts type members`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              type Mushishi = {
                birthname: 'Yoki'
                name: 'Ginko'
                status: 'wanderer'
              }
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              type Mushishi = {
                name: 'Ginko'
                birthname: 'Yoki'
                status: 'wanderer'
              }
            `,
            output: dedent`
              type Mushishi = {
                birthname: 'Yoki'
                name: 'Ginko'
                status: 'wanderer'
              }
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'name',
                  second: 'birthname',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts type members in function args`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              let handleDemonSlayerAttack = (attack: {
                attackType: string
                demon: string
                slayerName: string
              }) => {
                // ...
              }
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              let handleDemonSlayerAttack = (attack: {
                slayerName: string
                attackType: string
                demon: string
              }) => {
                // ...
              }
            `,
            output: dedent`
              let handleDemonSlayerAttack = (attack: {
                attackType: string
                demon: string
                slayerName: string
              }) => {
                // ...
              }
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'slayerName',
                  second: 'attackType',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts type members with computed keys`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              type SquadMember = {
                [key: string]: string
                age?: 30
                name: 'Levi Ackermann'
                occupation: 'soldier'
                rank: 'captain'
                [residence]: 'Wall Rose'
              }
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              type SquadMember = {
                age?: 30
                [key: string]: string
                occupation: 'soldier'
                name: 'Levi Ackermann'
                [residence]: 'Wall Rose'
                rank: 'captain'
              }
            `,
            output: dedent`
              type SquadMember = {
                [key: string]: string
                age?: 30
                name: 'Levi Ackermann'
                occupation: 'soldier'
                rank: 'captain'
                [residence]: 'Wall Rose'
              }
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'age',
                  second: '[key: string]',
                },
              },
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'occupation',
                  second: 'name',
                },
              },
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'residence',
                  second: 'rank',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts type members with any key types`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              type ParanoiaAgent = {
                [...kills]
                [[data]]: string
                [name in victims]?
                [8]: Victim
                goldenBatAttack(): void
                hide?: () => void
              }
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              type ParanoiaAgent = {
                [...kills]
                [[data]]: string
                goldenBatAttack(): void
                [8]: Victim
                hide?: () => void
              }
            `,
            output: dedent`
              type ParanoiaAgent = {
                [...kills]
                [[data]]: string
                [8]: Victim
                goldenBatAttack(): void
                hide?: () => void
              }
            `,
            options: [
              {
                type: SortType.natural,
                order: SortOrder.asc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'goldenBatAttack(): void',
                  second: '8',
                },
              },
            ],
          },
        ],
      })
    })
  })

  describe(`${RULE_NAME}: sorting by line length`, () => {
    let type = 'line-length-order'

    it(`${RULE_NAME}(${type}): sorts type members`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              type Mushishi = {
                status: 'wanderer'
                birthname: 'Yoki'
                name: 'Ginko'
              }
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              type Mushishi = {
                name: 'Ginko'
                birthname: 'Yoki'
                status: 'wanderer'
              }
            `,
            output: dedent`
              type Mushishi = {
                status: 'wanderer'
                birthname: 'Yoki'
                name: 'Ginko'
              }
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'name',
                  second: 'birthname',
                },
              },
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'birthname',
                  second: 'status',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts type members in function args`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              let handleDemonSlayerAttack = (attack: {
                attackType: string
                slayerName: string
                demon: string
              }) => {
                // ...
              }
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              let handleDemonSlayerAttack = (attack: {
                slayerName: string
                demon: string
                attackType: string
              }) => {
                // ...
              }
            `,
            output: dedent`
              let handleDemonSlayerAttack = (attack: {
                attackType: string
                slayerName: string
                demon: string
              }) => {
                // ...
              }
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'demon',
                  second: 'attackType',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts type members with computed keys`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              type SquadMember = {
                [residence]: 'Wall Rose'
                name: 'Levi Ackermann'
                [key: string]: string
                occupation: 'soldier'
                rank: 'captain'
                age?: 30
              }
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              type SquadMember = {
                age?: 30
                [key: string]: string
                occupation: 'soldier'
                name: 'Levi Ackermann'
                [residence]: 'Wall Rose'
                rank: 'captain'
              }
            `,
            output: dedent`
              type SquadMember = {
                [residence]: 'Wall Rose'
                name: 'Levi Ackermann'
                occupation: 'soldier'
                [key: string]: string
                rank: 'captain'
                age?: 30
              }
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'age',
                  second: '[key: string]',
                },
              },
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'occupation',
                  second: 'name',
                },
              },
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: 'name',
                  second: 'residence',
                },
              },
            ],
          },
        ],
      })
    })

    it(`${RULE_NAME}(${type}): sorts type members with any key types`, () => {
      ruleTester.run(RULE_NAME, rule, {
        valid: [
          {
            code: dedent`
              type ParanoiaAgent = {
                goldenBatAttack(): void
                hide?: () => void
                [[data]]: string
                [8]: Victim
                [...kills]
              }
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
          },
        ],
        invalid: [
          {
            code: dedent`
              type ParanoiaAgent = {
                [...kills]
                [[data]]: string
                goldenBatAttack(): void
                [8]: Victim
                hide?: () => void
              }
            `,
            output: dedent`
              type ParanoiaAgent = {
                goldenBatAttack(): void
                hide?: () => void
                [[data]]: string
                [8]: Victim
                [...kills]
              }
            `,
            options: [
              {
                type: SortType['line-length'],
                order: SortOrder.desc,
              },
            ],
            errors: [
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: '[...kills]',
                  second: '[[data]]',
                },
              },
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: '[[data]]',
                  second: 'goldenBatAttack(): void',
                },
              },
              {
                messageId: 'unexpectedObjectTypesOrder',
                data: {
                  first: '8',
                  second: 'hide',
                },
              },
            ],
          },
        ],
      })
    })
  })
})
