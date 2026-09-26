interface LogoSphereProps {
  className?: string;
  as?: 'span' | 'div';
}

/** Esfera oficial de SITIIO (asset: /images/branding/logo-sitiio.webp vía --sitiio-logo). */
export function LogoSphere({ className, as: Tag = 'span' }: LogoSphereProps) {
  return <Tag className={className ? `logo-sphere ${className}` : 'logo-sphere'} aria-hidden="true" />;
}

/** "SITIIO" con la doble "II" separada levemente para leerse como símbolo. */
export function Wordmark() {
  return (
    <span>
      SIT<span className="ii">II</span>O
    </span>
  );
}
