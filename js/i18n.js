const lngs = {
  en: { nativeName: "EN" },
  es: { nativeName: "ES" },
};

const rerender = () => {
  // start localizing, details:
  // https://github.com/i18next/jquery-i18next#usage-of-selector-function
  $("body").localize();
  $.unblockUI();
};

$(function () {
  // use plugins and options as needed, for options, detail see
  // https://www.i18next.com
  i18next
    // i18next-http-backend
    // loads translations from your server
    // https://github.com/i18next/i18next-http-backend
    .use(i18nextHttpBackend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(i18nextBrowserLanguageDetector)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init(
      {
        debug: true,
        supportedLngs: ["es", "en"],
        fallbackLng: "en",
      },
      (err, t) => {
        if (err) return console.error(err);

        // define the formatter function
        i18next.services.formatter.add("range", (value, lng, options) => {
          return `${moment(value[0], "MMMM YYYY")
            .locale(lng)
            .format("MMMM YYYY")} - ${
            value[1] == "now"
              ? lng == "es"
                ? "Actual"
                : "Present"
              : moment(value[1], "MMMM YYYY").locale(lng).format("MMMM YYYY")
          }`;
        });

        i18next.services.formatter.add("phone", (value, lng, options) => {
          console.log("val", value);
          const phoneNumber = libphonenumber.parsePhoneNumber(
            value.toString(),
            "MX"
          );
          return `${
            lng == "es"
              ? phoneNumber.formatNational()
              : phoneNumber.formatInternational()
          }`;
        });

        // for options see
        // https://github.com/i18next/jquery-i18next#initialize-the-plugin
        jqueryI18next.init(i18next, $, { useOptionsAttr: true });
        // console.log(i18next.resolvedLanguage);
        // fill language switcher
        Object.keys(lngs).map((lng) => {
          const opt = new Option(lngs[lng].nativeName, lng);
          if (lng === i18next.resolvedLanguage) {
            opt.setAttribute("selected", "selected");
          }
          $("#languageSwitcher").append(opt);
        });
        $("#languageSwitcher").change((a, b, c) => {
          const chosenLng = $(this).find("option:selected").attr("value");
          i18next.changeLanguage(chosenLng, () => {
            rerender();
          });
        });

        rerender();
      }
    );
});
