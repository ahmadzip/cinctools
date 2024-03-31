import ReactTypingEffect from 'react-typing-effect';

export default function RuningText({ text }: { text: string }) {
  return (
    <label className="mb-5 block text-xl font-semibold text-center">
      <ReactTypingEffect text={text} speed={100} eraseDelay={100} />
    </label>
  );
}
