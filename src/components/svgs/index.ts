// @index('./*.{png,jpg,svg}', (f, _) => `export { default as Icon${_.pascalCase(f.name)} } from '${f.path}${f.ext}'`)
export { default as IconGoogleLogo } from "./google-logo.svg";
