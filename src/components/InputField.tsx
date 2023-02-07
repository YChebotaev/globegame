import React, { useState, useContext, useRef, useMemo } from 'react';
import { FormattedMessage } from "react-intl";

import { LocaleContext } from "../i18n/LocaleContext";

import { Keyboard } from './keyboard/Keyboard'
import Fade from './modal/Fade';
import Hints from './Hints';

type Props = {
    handleSubmit: (value : string) => string;
    setMsg: (string | any)[];
    isHints: boolean
    countries: { features: never[] }
};

const InputField = ({
  handleSubmit,
  setMsg,
  isHints,
  countries
} : Props) => {
  
    const { locale } = useContext(LocaleContext);
    const [value, setValue] = useState('');

    const [show, setShow] = useState(true);

    const formRef = useRef<HTMLFormElement>(null);
    const hints = useMemo(() => {
      const hints: string[] = []

      if (isHints && value !== '') {
        for (let { properties } of countries.features) {
          const name = Reflect.get(properties, 'ADMIN') as string
  
          if (name.toLowerCase().startsWith(value.toLowerCase())) {
            hints.push(name)
          }
        }
      }

      return hints
    }, [value, countries.features, isHints])

    function exSubmit(e : any) {
      e.preventDefault();
      onEnter();
    }

    function onChar(c : string) {
      if (setMsg[0] === "Game4") {
        setShow(false);
      }
      setValue(value+c);
    }

    function onEnter() {
      setShow(true);
      let answ = handleSubmit(value);
      if (answ == "" || answ == "Game4") {
        setValue("");
      }
      setMsg[1](answ);
      if (answ === "Game4" || answ === "Game3") {
        return;
      }
      setTimeout(() => setShow(false), 3000);
    }

    function onClickHint(value: string) {
      setShow(true);

      const answ = handleSubmit(value);

      if (answ == "" || answ == "Game4") {
        setValue("");
      }

      setMsg[1](answ);

      if (answ === "Game4" || answ === "Game3") {
        return;
      }

      setTimeout(() => setShow(false), 3000);
    }

    function onSpace() {
      if (value[value.length-1] == ' ') return;
      setValue(value + " ");
    }

    function onDelete() {
      setValue(value.substring(0, value.length-1));
    }

    function font_Size(textLength : number) {
      const baseSize = 2.25;
      textLength = baseSize - (value.length*0.05);
      if (textLength < 1.2) {
        textLength = 1.2;
      }
      return `${textLength}rem`;
    }

    let fsize = font_Size(value.length);
    let divStyle = {
      fontSize: fsize,
    };

    return (

      <div>
        {setMsg[0] !== "" ?
        <Fade
          show={show}
          extdiv="absolute z-9 top-48 w-full px-1 left-1/2 -translate-x-2/4"
          background="border-4 border-sky-300 dark:border-slate-700 bg-sky-100 dark:bg-slate-900 drop-shadow-xl w-fit inset-x-0 py-4 px-4 rounded-md space-y-2 mx-auto">
          <p className="text-sm text-center text-gray-500 dark:text-gray-300">

            <FormattedMessage
              id={setMsg[0]}
              values={{
                span: (chunks: string) => {
                  try {
                    const [click, tap] = JSON.parse(chunks);
                    return <span>{click}</span>;
                  } catch (e) {
                    return <span>{chunks}</span>;
                  }
                },
              }}/>
          </p>
        </Fade> : ''}

            <div className="absolute bottom-1 w-full">
              {isHints && <Hints formRef={formRef} hints={hints} onClickHint={onClickHint} />}

              <form ref={formRef} className="mx-auto table relative bottom-1" onSubmit={e => exSubmit(e)}>
                <span className='input' style={divStyle}>{value}</span>
                <span className='input cursor relative bottom-1' style={divStyle}>|</span>
              </form>

              <Keyboard
                  onChar={onChar}
                  onDelete={onDelete}
                  onEnter={onEnter}
                  onSpace={onSpace}
                  isRevealing={false}
                />

            </div>

      </div>
    )};

export default InputField;
