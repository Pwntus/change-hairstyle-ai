export default defineEventHandler(async (event) => {
  const { image, hairstyle, shade, color } = await readBody(event)

  // Create prediction
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + useRuntimeConfig().replicateApiToken
    },
    body: JSON.stringify({
      version:
        'b95cb2a16763bea87ed7ed851d5a3ab2f4655e94bcfb871edba029d4814fa587',
      input: {
        image,
        editing_type: 'both',
        hairstyle_description: hairstyle,
        color_description: `${shade} ${color}`
      }
    })
  })
  const json = await response.json()

  // Parse prediction
  const id = json.id
  const status = json.status
  const output = json.output

  return { id, status, output }
})
