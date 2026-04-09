import Link from 'next/link';
import Image from 'next/image';

import Maroca from '../public/maroca.png';

export default function Header({ name }) {
  return (
    <Link href="/">
      <header className="pt-20 pb-12">
        <Image
          src={Maroca}
          alt="Maroca"
          width={200}
          height={200}
          placeholder="blur"
        />
        <p className="text-2xl dark:text-white text-center">
          <a>{name}</a>
        </p>
      </header>
    </Link>
  );
}
