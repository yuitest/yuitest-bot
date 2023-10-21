import fs from 'fs'

import { tweet } from './twitter'

if (require.main === module) {
  ;(async () => {
    const hash = fs.readFileSync('.git/refs/heads/main', 'utf8')
    await tweet(`じゃきーん ! バージョン ${hash} になりました`)
  })()
}
