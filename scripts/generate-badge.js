#!/usr/bin/env node

/**
 * Generate a coverage badge SVG locally without requiring network access.
 * This script reads the coverage summary and generates a badge SVG file.
 */

import { readFile, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Get badge color based on coverage percentage
 *
 * @param {number} coverage - Coverage percentage
 * @returns {string} Color for the badge
 */
const getColor = (coverage) => {
  if (coverage < 80) {
    return '#e05d44' // red
  }
  if (coverage < 90) {
    return '#dfb317' // yellow
  }
  return '#4c1' // brightgreen
}

/**
 * Generate SVG badge content
 *
 * @param {number} coverage - Coverage percentage
 * @returns {string} SVG content
 */
const generateSVG = (coverage) => {
  const coverageText = `${coverage}%`
  const color = getColor(coverage)
  const labelWidth = 63
  const valueWidth = 43
  const totalWidth = labelWidth + valueWidth

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="Coverage: ${coverageText}"><title>Coverage: ${coverageText}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="${labelWidth}" height="20" fill="#555"/><rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/><rect width="${totalWidth}" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="325" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="530">Coverage</text><text x="325" y="140" transform="scale(.1)" fill="#fff" textLength="530">Coverage</text><text aria-hidden="true" x="835" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="330">${coverageText}</text><text x="835" y="140" transform="scale(.1)" fill="#fff" textLength="330">${coverageText}</text></g></svg>`
}

/**
 * Main function to generate the badge
 */
async function main() {
  try {
    const reportPath = join(__dirname, '../coverage/coverage-summary.json')
    const outputPath = join(__dirname, '../badges/coverage.svg')

    const reportContent = await readFile(reportPath, 'utf8')
    const report = JSON.parse(reportContent)

    if (!(report && report.total && report.total.statements)) {
      throw new Error('Malformed coverage report')
    }

    const coverage = report.total.statements.pct
    const svg = generateSVG(coverage)

    await writeFile(outputPath, svg, 'utf8')
    console.log(`✓ Coverage badge generated: ${outputPath} (${coverage}%)`)
  } catch (error) {
    console.error('Error generating coverage badge:', error.message)
    process.exit(1)
  }
}

main()
