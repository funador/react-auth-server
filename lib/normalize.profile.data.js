module.exports = profile => {
  const { provider } = profile
  
  switch(provider) {
    case 'twitter':
      return { 
        name: profile.username,
        photo: profile.photos[0].value.replace(/_normal/, '')
      }
    
    case 'google':
      return { 
        name: profile.displayName,
        photo: profile.photos[0].value.replace(/sz=50/gi, 'sz=250')
      }
    
    case 'facebook':
      const { givenName = '', familyName = '' } = profile.name
      return { 
        name: `${givenName} ${familyName}`,
        photo: profile.photos[0].value
      }

    case 'github':
      return { 
        name: profile.username,
        photo: profile.photos[0].value
      }
  }
}