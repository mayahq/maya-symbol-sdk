import fieldEval from './utils/fieldEval.ts'
import utils from './utils/index.ts'

// @deno-types="npm:@types/lodash@4.14.194"
export interface OnMessageCallback { (done: unknown): void}

export {default as lodash} from 'npm:lodash@4.17.21'
export {default as mayautils} from "./utils/index.ts"