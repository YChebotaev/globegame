import { useEffect } from 'react'
import { BackspaceIcon } from '@heroicons/react/24/outline'
import SpaceIcon from '../icons/SpaceIcon'
import EnterIcon from '../icons/EnterIcon'

import { Key } from './Key'

const DELETE_TEXT = <BackspaceIcon width={48} /> // 'Delete';
const ENTER_TEXT = <EnterIcon /> // 'Enter';
const SPACE_TEXT = <SpaceIcon /> // 'Space';

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  onSpace: () => void
  isRevealing?: boolean
}

export const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  onSpace,
  isRevealing,
}: Props) => {

  const onClick = (value: string) => {
    if (value === 'ENTER') {
      onEnter()
    } else if (value === 'DELETE') {
      onDelete()
    } else if (value === 'Space') {
      onSpace()
    } else {
      onChar(value)
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
      } else if (e.code === 'Space') {
        onSpace()
      } else {
        const key = e.key.toUpperCase()
        // TODO: check this test if the range works with non-english letters
        if (key.length === 1 && key >= 'A' && key <= 'Z') {
          onChar(key)
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar])

  return (
    <div>
      <div className="mb-1 flex justify-center">
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={undefined}
            isRevealing={isRevealing}
          />
        ))}
      </div>
      <div className="mb-1 flex justify-center">
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={undefined}
            isRevealing={isRevealing}
          />
        ))}
        <Key width={65.4} value="Space" onClick={onClick}>
          {SPACE_TEXT}
        </Key>
      </div>
      <div className="flex justify-center">
        <Key width={65.4} value="DELETE" onClick={onClick}>
          {DELETE_TEXT}
        </Key>
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={undefined}
            isRevealing={isRevealing}
          />
        ))}
        <Key width={65.4} value="ENTER" onClick={onClick}>
          {ENTER_TEXT}
        </Key>
      </div>
    </div>
  )
}