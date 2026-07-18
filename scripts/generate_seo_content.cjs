const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const blogDir = path.join(__dirname, '..', 'public', 'blog');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'seoContent.json');

const seoContent = [];

if (fs.existsSync(blogDir)) {
  const folders = fs.readdirSync(blogDir);
  
  for (const slug of folders) {
    const indexPath = path.join(blogDir, slug, 'index.html');
    if (!fs.existsSync(indexPath)) continue;
    
    const html = fs.readFileSync(indexPath, 'utf-8');
    const $ = cheerio.load(html);
    
    const title = $('h1').first().text();
    const dateText = $('.meta-date').first().text();
    const date = dateText.replace('Published on ', '').trim();
    
    const article = $('article');
    const sections = [];
    let currentSection = null;
    let paragraphs = [];
    
    article.children().each((i, el) => {
      const tagName = el.tagName.toLowerCase();
      
      if (tagName === 'h2') {
        if (currentSection) {
          sections.push({ h2: currentSection, p: paragraphs.join('\n') });
        }
        currentSection = $(el).text();
        paragraphs = [];
      } else if (tagName === 'p' || tagName === 'ul' || tagName === 'li') {
        // Just extract text content for simplicity, or we can keep it as is.
        // Actually, let's just get outerHTML of paragraphs/lists if needed,
        // but the previous blogs.json used {h2: "", p: ""} format.
        if (currentSection) {
          if (tagName === 'ul') {
             $(el).find('li').each((j, li) => {
               paragraphs.push('- ' + $(li).text());
             });
          } else {
             paragraphs.push($(el).text());
          }
        }
      }
    });
    
    if (currentSection) {
      sections.push({ h2: currentSection, p: paragraphs.join('\n') });
    }
    
    seoContent.push({
      slug,
      title,
      date,
      sections,
      faq: [] // legacy blogs don't seem to have faq in the same format
    });
  }
}

// Also include the blogs from blogs.json if it exists
const blogsJsonPath = path.join(__dirname, '..', 'src', 'data', 'blogs.json');
if (fs.existsSync(blogsJsonPath)) {
  const generatedBlogs = JSON.parse(fs.readFileSync(blogsJsonPath, 'utf-8'));
  for (const gb of generatedBlogs) {
    if (!seoContent.find(sc => sc.slug === gb.slug)) {
      seoContent.push(gb);
    }
  }
}

fs.writeFileSync(outputFile, JSON.stringify(seoContent, null, 2));
console.log(`Generated seoContent.json with ${seoContent.length} articles.`);
