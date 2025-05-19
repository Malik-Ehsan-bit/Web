$(document).ready(function () {
  // Initial styles
  $(".hero-section h1, .hero-section p").css({
    opacity: 0,
    transform: "translateY(40px)",
  });

  // Hero Section Text Animation (excluding button)
  $(".hero-section h1")
    .eq(0)
    .delay(200)
    .animate(
      { opacity: 1 },
      {
        duration: 800,
        step: function (now) {
          $(this).css("transform", "translateY(" + (40 - now * 40) + "px)");
        },
        complete: function () {
          // Apply line spacing after animation
          $(this).css({
            transition: "line-height 0.6s ease",
            lineHeight: "3rem",
          });

          $(".hero-section h1")
            .eq(1)
            .animate(
              { opacity: 1 },
              {
                duration: 800,
                step: function (now) {
                  $(this).css(
                    "transform",
                    "translateY(" + (40 - now * 40) + "px)"
                  );
                },
                complete: function () {
                  $(".hero-section p").animate(
                    { opacity: 1 },
                    {
                      duration: 800,
                      step: function (now) {
                        $(this).css(
                          "transform",
                          "translateY(" + (40 - now * 40) + "px)"
                        );
                      },
                    }
                  );
                },
              }
            );
        },
      }
    );

  // Service Cards Hover Effect
  $(".card").css({
    transition: "all 0.4s ease-in-out",
    transform: "scale(1)",
    boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
  });

  $(".card").hover(
    function () {
      $(this).stop().css({
        transform: "scale(1.05)",
        boxShadow: "0 15px 30px rgba(0,0,0,0.25)",
        backgroundColor: "#219ebc",
        color: "#fff",
      });
    },
    function () {
      $(this).stop().css({
        transform: "scale(1)",
        boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#023047",
        color: "#fff",
      });
    }
  );
});