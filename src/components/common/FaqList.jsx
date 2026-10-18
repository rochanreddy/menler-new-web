import FaqItem from './FaqItem';

export default function FaqList({ items, headings = false }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <FaqItem key={i} question={item.q} answer={item.a} heading={headings} />
      ))}
    </div>
  );
}
