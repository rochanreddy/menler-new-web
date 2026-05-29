import { useReveal } from '../../hooks/useReveal';

/**
 * Fades + lifts its children into view on scroll. `delay` (ms) staggers
 * items in a grid. Renders a div by default; pass `as` to change the tag.
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style, ...rest }) {
  const [ref, inView] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' in-view' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
