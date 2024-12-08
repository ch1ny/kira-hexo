const cheerio = require("cheerio");
const toc = require("markdown-toc");

const config = hexo.config.toc || {};
hexo.config.toc = Object.assign({}, config);

function insert(data) {
  const options = Object.assign({}, this.config.toc);

  // add class option
  if (options.class) {
    data.content = data.content.replace(
      "<!-- toc -->",
      '<div class="' +
        options.class +
        'Start"></div><!-- toc --><div class="' +
        options.class +
        'End"></div>',
    );
  }

  data.content = toc.insert(data.content, options);
  return data;
}

function heading(data) {
  const options = Object.assign({}, this.config.toc);

  const $ = cheerio.load(data.content, {
    decodeEntities:
      options.decodeEntities !== undefined ? options.decodeEntities : false,
  });
  const headings = $("h1, h2, h3, h4, h5, h6");

  headings.each(function () {
    const $title = $(this);
    const title = $title.text();
    const id = toc.slugify(title, options);
    // $title.attr('id', id);
    $title.children("a").remove();
    $title.html(
      '<span id="' + encodeURIComponent(id) + '">' + $title.html() + "</span>",
    );
    $title.removeAttr("id");

    if (options.anchor) {
      const anchorOpts = Object.assign(
        {
          position: "after",
          symbol: "#",
          style: "header-anchor",
        },
        options.anchor,
      );

      //  Put the anchor after the title by default, unless says otherwise
      const link =
        '<a href="#' +
        id +
        '" class="' +
        anchorOpts.style +
        '">' +
        anchorOpts.symbol +
        "</a>";
      if (anchorOpts.position === "before") {
        $title.prepend(link);
      } else {
        $title.append(link);
      }
    }
  });

  data.content = $.html();

  // add class option
  if (options.class) {
    data.content = data.content
      .replace(
        '<div class="' + options.class + 'Start"></div>',
        '<div class="' + options.class + '">',
      )
      .replace('<div class="' + options.class + 'End"></div>', "</div>");
  }

  return data;
}

hexo.extend.filter.register("before_post_render", insert);
hexo.extend.filter.register("after_post_render", heading);
