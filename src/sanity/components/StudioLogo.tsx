// Image import removed


export function StudioLogo(props: any) {
  // console.log('StudioLogo rendering', props)
  const { renderDefault, title } = props
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* 
        The logo is in public/images/logo/black_mode.svg
        Next.js Image might be tricky inside Sanity Studio if strictly client-side without Next context 
        BUT this is an embedded studio in Next.js (/app/studio/...), so we can use standard img or Next Image.
        Let's use standard <img> to be safe within the Sanity Shell context if needed, 
        but usually <Image> works if next/image is configured. 
        Safest: <img src="..." />
      */}
      <img 
        src="/images/logo/white_mode.svg" 
        alt="NMarkFire"  
        style={{ height: '24px', width: 'auto', objectFit: 'contain' }} 
      />
      <span style={{ fontWeight: 800, fontSize: '18px', color: '#111', letterSpacing: '-0.5px' }}>
        NMark<span style={{ color: '#dc2626' }}>Fire</span> OS
      </span>
      {/* Optionally render default title if we want, but we are replacing it */}
    </div>
  )
}
