export default defineEventHandler(async (event) => {
  const { image, hairstyle, shade, color } = await readBody(event)

  // Create prediction
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + process.env.NUXT_REPLICATE_API_TOKEN
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
  const getURL = json.urls.get

  // Kepp polling prediction until an output is created (or failed)
  let status = null
  let output = null
  while (!output) {
    const response_status = await fetch(getURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + process.env.NUXT_REPLICATE_API_TOKEN
      }
    })
    const json_status = await response_status.json()

    // Parse prediction status
    status = json_status.status

    if (status === 'succeeded') {
      output = json_status.output
      break
    }
    if (status === 'failed') break
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return { id, status, output, hairstyle, shade, color }
})
