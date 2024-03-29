import React, { useCallback, useState } from "react";
import Modal from "react-modal";
import SwipeableViews from "react-swipeable-views";

import { Button } from "~/components/Button";
import { useSiteData } from "~/lib/site-data";

import styles from "~/styles/utils.module.css";

const { fontheadings: headings, scrollingtouch } = styles;

Modal.setAppElement("#__next");

export const MuniModal = ({
  active,
  closeModal,
}: {
  active: boolean;
  closeModal: () => void;
}) => {
  const { t, lang } = useSiteData();

  const slides: [string, string | JSX.Element][] = [
    [
      "/images/ref1.png",
      <span key="ref1">
        {t("ref1-1")}
        <a
          className="underline font-bold"
          target="_blank"
          rel="noopener noreferrer"
          href="https://servicesenligne2.ville.montreal.qc.ca/sel/evalweb/"
        >
          {t("ref1-2")}
        </a>
        {t("ref1-3")}
      </span>,
    ],
    [lang === "en" ? "/images/ref2-en.png" : "/images/ref2-fr.png", t("ref2")],
    ["/images/ref3.png", t("ref3")],
    ["/images/ref4.png", t("ref4")],
    ["/images/ref5.png", t("ref5")],
  ];

  return (
    <BaseModal active={active} closeModal={closeModal}>
      <HelpDialog
        title={t("ref-title")}
        slides={slides}
        closeModal={closeModal}
      />
    </BaseModal>
  );
};

export const SchoolModal = ({
  active,
  closeModal,
}: {
  active: boolean;
  closeModal: () => void;
}) => {
  const { t } = useSiteData();

  const slides: [string, string | JSX.Element][] = [
    [
      "/images/tfp1.png",
      <span key="tfp1txt">
        {t("tfp1-1")}
        <a
          className="underline font-bold"
          target="_blank"
          rel="noopener noreferrer"
          href="https://tfp.cgtsim.qc.ca/asp/tfp.aspx"
        >
          {t("tfp1-2")}
        </a>
        {t("tfp1-3")}
      </span>,
    ],
    ["/images/tfp2.png", t("tfp2")],
    ["/images/tfp3.png", t("tfp3")],
    [
      "/images/tfp4.png",
      <div key="tpf4">
        <p>{t("tfp4-1")}</p>
        <p className="mt-2 text-gray-800 italic">{t("tfp4-2")}</p>
      </div>,
    ],
    ["/images/tfp5.png", t("tfp5")],
    // FIXME: ugh, each slide should just be an mdx block.
    // this is clunky and won't localize well to other languages either.
    [
      "/images/tfp6.png",
      <div key="tfp6txt">
        <div className="mb-6">{t("tfp6-1")}</div>
        <img
          className="border border-black mx-auto mb-4"
          src="/images/tfp7.png"
        />
        <div className="mb-4">
          <span>{t("tfp6-2")}</span>
          <span className="font-bold">{t("tfp6-3")}</span>
          <span>{t("tfp6-4")}</span>
          <span className="font-bold">{t("tfp6-5")}</span>
        </div>
        <div>{t("tfp6-6")}</div>
      </div>,
    ],
  ];

  return (
    <BaseModal active={active} closeModal={closeModal}>
      <HelpDialog
        title={t("tfp-title")}
        slides={slides}
        closeModal={closeModal}
      />
    </BaseModal>
  );
};

const HelpDialog = ({
  title,
  slides,
  closeModal,
}: {
  title: string;
  slides: [string, string | JSX.Element][];
  closeModal: () => void;
}) => {
  const { t } = useSiteData();
  const [slide, setSlide] = useState(0);
  const goToSlide = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setSlide(parseInt(e.currentTarget.dataset["slide"]!));
  }, []);

  const notLastSlide = slide < slides.length - 1;

  const dots = [];
  for (let i = 0; i < slides.length; i++) {
    dots.push(
      <div
        key={i}
        data-slide={i}
        onClick={goToSlide}
        className={`cursor-pointer border border-indigo-700 rounded-full w-2 h-2 mx-px sm:mx-1 ${
          slide === i ? "bg-indigo-700" : ""
        }`}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className={`${headings} text-2xl uppercase font-bold italic px-2 sm:px-4 mt-2 sm:mt-4 mb-4`}
      >
        {title}
      </div>
      <SwipeableViews
        className="h-full"
        slideClassName="flex flex-col sm:justify-center"
        index={slide}
        onChangeIndex={(i) => {
          setSlide(i);
        }}
      >
        {slides.map(([image, text], i) => (
          <div key={i} className="px-2">
            <img className="border border-black mx-auto mb-4" src={image} />
            <div className="mb-1 px-2 mx-auto max-w-xl">{text}</div>
          </div>
        ))}
      </SwipeableViews>
      <div className="w-full mt-auto pt-2 px-2 sm:px-4 mb-2 sm:mb-4 flex justify-between items-center">
        <Button
          onClick={() => {
            if (slide > 0) setSlide(slide - 1);
            else closeModal();
          }}
          className={`text-lg flex items-center py-2 pl-1 pr-3 text-white ${
            slide === 0
              ? "bg-indigo-400 hover:bg-indigo-500"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          <svg viewBox="0 0 24 24" width="24px" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
          </svg>
          <span>{t("back")}</span>
        </Button>
        <div className="flex">{dots}</div>
        <Button
          onClick={() => {
            if (notLastSlide) setSlide(slide + 1);
            else closeModal();
          }}
          className={`text-lg flex items-center py-2 pl-3 text-white ${
            notLastSlide
              ? "pr-1 bg-indigo-700 hover:bg-indigo-800"
              : "pr-3 bg-emerald-700 hover:bg-emerald-800"
          }`}
        >
          <span>{notLastSlide ? t("next") : t("done")}</span>
          {notLastSlide && (
            <svg viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
};

// removed modal default styles:
// border-radius: 4px;
// padding: 20px;

const modalContent = `${scrollingtouch} max-w-3xl outline-none border border-gray-300 bg-white overflow-auto m-auto absolute inset-2 sm:inset-10`;

export const BaseModal: React.FC<{
  active: boolean;
  closeModal: () => void;
}> = ({ active, closeModal, children }) => {
  return (
    <Modal
      className={modalContent}
      isOpen={active}
      closeTimeoutMS={300}
      onRequestClose={closeModal}
      contentLabel="modal"
    >
      {children}
    </Modal>
  );
};
