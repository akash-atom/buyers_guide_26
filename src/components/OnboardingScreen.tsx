interface OnboardingScreenProps {
  onStart: () => void;
}

export default function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  return (
    <div className="flex flex-col">
      {/* Cover Image */}
      <div className="w-full h-64">
        <img
          src="/cover.png"
          alt="Cover"
          className="w-full h-full object-cover rounded-t-2xl"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col" style={{ marginTop: '62px', gap: '32px' }}>
        {/* Heading */}
        <h1 style={{ fontFamily: 'Inter Display', fontSize: '66px', fontWeight: 400, letterSpacing: '-1.32px', color: '#201515', lineHeight: 1 }}>
          Find your ITSM fit
        </h1>

        {/* Subheading */}
        <p style={{ fontFamily: 'Inter Display', fontSize: '18px', fontWeight: 400, letterSpacing: '-0.072px', color: '#000000', lineHeight: 1.5 }}>
          Most ITSM buying guides hand you a feature checklist and wish you luck. This framework takes a different approach. Instead of asking which features you want, we'll look at the work your IT team actually does and where you're trying to go
        </p>

        {/* Icon and text */}
        <div className="flex items-center gap-2">
          {/* Clock Icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.875 0C3.52617 0 0 3.52617 0 7.875C0 12.2238 3.52617 15.75 7.875 15.75C12.2238 15.75 15.75 12.2238 15.75 7.875C15.75 3.52617 12.2238 0 7.875 0ZM10.9775 10.2955L10.4748 10.9811C10.4639 10.996 10.4501 11.0086 10.4343 11.0182C10.4184 11.0278 10.4009 11.0341 10.3826 11.0369C10.3643 11.0397 10.3456 11.0388 10.3277 11.0344C10.3097 11.0299 10.2928 11.0219 10.2779 11.0109L7.37051 8.89102C7.3524 8.87801 7.33767 8.86084 7.32758 8.84096C7.31748 8.82107 7.31231 8.79906 7.3125 8.77676V3.9375C7.3125 3.86016 7.37578 3.79688 7.45312 3.79688H8.29863C8.37598 3.79688 8.43926 3.86016 8.43926 3.9375V8.28809L10.9459 10.1004C11.0092 10.1443 11.0232 10.2322 10.9775 10.2955Z" fill="#101828"/>
          </svg>
          {/* Text */}
          <span style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 400, color: '#201515', lineHeight: 1 }}>Takes 2 mins</span>
        </div>
      </div>

      {/* Button - positioned at bottom with no spacing */}
      <button
        onClick={onStart}
        className="text-white transition-all shadow-lg w-full"
        style={{
          borderRadius: '0 0 16px 16px',
          marginTop: '32px',
          marginLeft: '-16px',
          marginRight: '-16px',
          marginBottom: '-16px',
          width: 'calc(100% + 32px)',
          fontFamily: 'Inter Display',
          fontWeight: 500,
          fontSize: '32px',
          letterSpacing: '-0.48px',
          padding: '16px 24px',
          lineHeight: 1,
          textAlign: 'right',
          background: 'linear-gradient(to right, #9966FF, #5C3D99)',
          cursor: 'pointer'
        }}
      >
        Let's find out →
      </button>
    </div>
  );
}
