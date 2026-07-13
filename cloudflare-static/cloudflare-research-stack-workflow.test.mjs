import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const workflow = fs.readFileSync(new URL('../.github/workflows/cloudflare-research-stack.yml', import.meta.url), 'utf8')

test('composite deployment evidence is validated before artifact acceptance', () => {
  const recordIndex = workflow.indexOf('- name: Record stack deployment evidence')
  const validateIndex = workflow.indexOf('- name: Validate composite stack deployment evidence')
  const uploadIndex = workflow.indexOf('- name: Upload stack deployment evidence')

  assert.ok(recordIndex >= 0, 'evidence recording step is required')
  assert.ok(validateIndex > recordIndex, 'validation must follow evidence recording')
  assert.ok(uploadIndex > validateIndex, 'artifact upload must follow validation')

  const validationStep = workflow.slice(validateIndex, uploadIndex)
  assert.match(validationStep, /if: always\(\)/)
  assert.match(validationStep, /validate-stack-deployment-evidence\.mjs/)
  assert.match(validationStep, /cloudflare-stack-deployment-evidence-validation\.json/)
})

test('workflow executes the validator contract tests and retains validation output', () => {
  assert.match(workflow, /node --test cloudflare-static\/validate-stack-deployment-evidence\.test\.mjs/)
  assert.match(workflow, /cloudflare-stack-deployment-evidence-validation\.json/)
  assert.match(workflow, /Composite validation:/)
})
