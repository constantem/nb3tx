$('.sec-menu').on('shown.bs.collapse', function() {
			var maxHeight = -1;
			var minHeight = 100;
			var newHeight = 0;
			var secMenuCount = $(this).find('.sec-menu-item').length;

			$("#tbb-sec-menu-bg").css({
				"display": "flex"
			});

			$(this).find('.sec-menu-item').each(function() {
                 if ($(this).height() > 550) {
                    $(this).width(490);
                    $(this).find('li').addClass('tbb-menu-list-extend');
                }
				maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
				minHeight = minHeight < $(this).height() ? minHeight : $(this).height();
			});

			if (secMenuCount < 7) {
				newHeight = maxHeight;
				if (secMenuCount == 6 && maxHeight < 500) {
					newHeight = maxHeight + minHeight + 50;
				}
			} else {
				newHeight = maxHeight + minHeight + 5;
				if (secMenuCount == 10) {
					newHeight = maxHeight + minHeight * 0.7;
					if (maxHeight < 270) {
						newHeight = maxHeight + minHeight + 45;
					}
				}
				if (secMenuCount == 12) {
					newHeight = maxHeight + minHeight + 60;
				}
			}

			$(this).find('.sec-menu-list').height(newHeight);

			$('.sec-menu-list').isotope({
				layoutMode: 'fitColumns',
				itemSelector: '.sec-menu-item',
				transitionDuration: 0
			});
		})

		$('.sec-menu').on('hide.bs.collapse', function() {
			$("#tbb-sec-menu-bg").css({
				"display": "none"
			});
		})

		// When the user clicks on the button, scroll to the top of the document
		function topFunction() {
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		}
