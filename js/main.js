window.onload = () => {
    const navLinks = document.querySelectorAll('.nav-item');
    const menuToggle = document.getElementById('navbar');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {
        toggle: false
      });
    
    navLinks.forEach((l) => {
        l.addEventListener('click', () => { bsCollapse.toggle() })
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })



    var loadingTask = pdfjsLib.getDocument("assets/resume.pdf");
    loadingTask.promise.then(
        function (pdf) {
            // Load information from the first page.
            pdf.getPage(1).then(function (page) {
                var scale = 1;
                var viewport = page.getViewport({scale: scale});

                // Apply page dimensions to the <canvas> element.
                var canvas = document.getElementById("pdf");
                var context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render the page into the <canvas> element.
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.promise.then(function () {});
            });
        },
        function (reason) {
            console.error(reason);
        }
    );
}

$(window).on('show.bs.modal', function() { 
    $("#fc_frame").fadeOut()
});

$(window).on('hidden.bs.modal', function() { 
    $("#fc_frame").fadeIn()
});