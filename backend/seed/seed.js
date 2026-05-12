import 'dotenv/config'
import mongoose from 'mongoose'
import Artist from '../src/models/Artist.js'
import Artwork from '../src/models/Artwork.js'
import User from '../src/models/User.js'
import Comment from '../src/models/Comment.js'

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  await Artist.deleteMany({})
  await Artwork.deleteMany({})
  await Comment.deleteMany({})
  console.log('Cleared existing seed data')

  // ── 11 Artists ──────────────────────────────────────────────────────────
  const artists = await Artist.insertMany([
    // 0 ─ Albert Namatjira
    {
      name: 'Albert Namatjira',
      bio: 'Albert Namatjira (28 July 1902 – 8 August 1959), born Elea Namatjira, was a Western Arrernte watercolour painter from Hermannsburg Lutheran Mission in the Northern Territory. He grew up at the mission speaking Arrernte and German before learning English. In 1934 he met artist Rex Battarbee and began painting seriously; his first solo exhibition in Melbourne in 1938 sold out. His luminous landscapes of the MacDonnell Ranges, ghost gum trees, and Central Australian desert made him the first Aboriginal artist to be widely recognised by the Australian public and internationally. He received the Queen\'s Coronation Medal in 1953, met Queen Elizabeth II in 1954, and in 1957 became the first Aboriginal person in the Northern Territory to be granted full Australian citizenship. He painted approximately 2,000 works in his lifetime. He died in Alice Springs on 8 August 1959.',
      tribe: 'Western Arrernte',
      region: 'Central Australia, Northern Territory',
      birthYear: 1902,
      // Wikimedia Commons CC BY-SA 4.0 – portrait photograph, 1956
      profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Albert_Namatjira_portrait.jpg',
    },
    // 1 ─ Emily Kame Kngwarreye
    {
      name: 'Emily Kame Kngwarreye',
      bio: 'Emily Kame Kngwarreye (c.1910 – 3 September 1996) was an Anmatyerre painter born at Alhalkere in the Utopia Homelands, approximately 250 km north-east of Alice Springs. She was a senior custodian of Anmatyerre ceremony and a master of the anooralya (pencil yam) Dreaming. She began working in batik in 1977 and co-founded the Utopia Women\'s Batik Group in 1978. She did not switch to acrylic canvas painting until around 1988, when she was approximately 78 years old. In just eight years she produced an estimated 3,000 works, revolutionising Australian art with her bold, all-over abstraction. She represented Australia at the Venice Biennale in 1993 and her work was shown posthumously at the 1997 Biennale. In 2017 her painting Earth\'s Creation (1994) sold for A$2.1 million, setting a record for an Australian female artist. She died on 3 September 1996 in Alice Springs.',
      tribe: 'Anmatyerre',
      region: 'Utopia Homelands, Northern Territory',
      birthYear: 1910,
      // Wikimedia Commons CC BY-SA 4.0 – Tate Modern exterior, London, featuring Kngwarreye exhibition
      profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Emily_Kam_Kngwarray%2C_Tate_Modern%2C_London_23.jpg',
    },
    // 2 ─ Rover Thomas
    {
      name: 'Rover Thomas',
      bio: 'Rover Thomas Joolama (c.1926 – 11 April 1998), also known as Roba and Juluma, was a Wangkajunga and Kukatja Aboriginal Australian artist. He was born near Gunawaggii at Well 33 on the Canning Stock Route in the Great Sandy Desert of Western Australia. At around age ten he moved with his family to the Kimberley, where he later worked as a stockman and settled at Turkey Creek (Warmun). In 1977, inspired by a mystical experience linked to the devastation of Cyclone Tracy in 1974, he began painting dance boards on tea chests with his kinship uncle Paddy Jaminji for the Krill Krill ceremony. He soon moved to ochre on canvas and became a pioneer of the East Kimberley School, known for his stark aerial maps of country that recorded ceremony, landscape, and history—including the brutal frontier massacres of the Kimberley. In 1990 he became the first Aboriginal Australian to exhibit at the Venice Biennale. He won the John McCaughey Prize at the Art Gallery of New South Wales in the same year. He died on 11 April 1998 at Warmun, East Kimberley.',
      tribe: 'Wangkajunga/Kukatja',
      region: 'Kimberley, Western Australia',
      birthYear: 1926,
      // No freely licensed portrait available for Rover Thomas
    },
    // 3 ─ Clifford Possum Tjapaltjarri
    {
      name: 'Clifford Possum Tjapaltjarri',
      bio: 'Clifford Possum Tjapaltjarri AO (c.1932 – 21 June 2002) was an Anmatyerre painter born at Napperby Station in the Northern Territory. He was an expert wood-carver before taking up acrylic painting. When teacher Geoffrey Bardon arrived at Papunya in the early 1970s and encouraged the Aboriginal men to paint their Dreaming stories on canvas, Clifford Possum joined the Papunya Tula artists early in 1972 and immediately distinguished himself as one of the movement\'s most talented members. He pioneered the Western Desert Art Movement and became one of the most collected Aboriginal artists in history, with works held in the Royal Collection, the National Gallery of Australia, the Art Gallery of New South Wales, and the Kelton Foundation. His 1977 masterpiece Warlugulong sold at Sotheby\'s in July 2007 for A$2.4 million—purchased by the National Gallery of Australia—setting a then-record for Aboriginal art at auction. He died in Alice Springs on 21 June 2002, on the very day he was scheduled to receive his Order of Australia.',
      tribe: 'Anmatyerre',
      region: 'Central Desert, Northern Territory',
      birthYear: 1932,
      // Wikipedia EN fair-use portrait photograph
      profileImageUrl: 'https://upload.wikimedia.org/wikipedia/en/0/02/Clifford_Possum_Tjapaltjarri.jpg',
    },
    // 4 ─ Minnie Pwerle
    {
      name: 'Minnie Pwerle',
      bio: 'Minnie Pwerle (c.1910 – 25 November 2006) was an Anmatyerre painter born at Atnangkere in the Utopia Homelands, Northern Territory, and a niece of the celebrated Emily Kame Kngwarreye. She shared the same Alhalkere country and ceremony. Despite beginning to paint on canvas only around 1999—when she was approximately 89 years old—she produced hundreds of works in just seven years. Her central subject is Awelye, the women\'s body-paint ceremony, which she renders as bold, sweeping arcs and brush-dragged marks of vivid colour across large canvases, often in reds, oranges, purples and whites. Her work is held in the National Gallery of Australia, the Kluge-Ruhe Collection (University of Virginia), and the Musée du quai Branly in Paris. Her painting Awelye (2000) sold for over A$150,000. She died at Utopia on 25 November 2006.',
      tribe: 'Anmatyerre',
      region: 'Utopia Homelands, Northern Territory',
      birthYear: 1910,
      profileImageUrl: 'https://www.kateowengallery.com/artists/Min169/artistPic.jpg',
    },
    // 5 ─ Wenten Rubuntja
    {
      name: 'Wenten Rubuntja',
      bio: 'Wenten Rubuntja (1926 – 3 April 2005) was a Western Arrernte painter and land rights activist born at Hermannsburg (Ntaria), Northern Territory. He was one of the leading painters of the Hermannsburg School, the tradition of European-style watercolour landscape painting established by Albert Namatjira in the 1930s, and he continued to develop that tradition by incorporating Central Arrernte ceremonial imagery and symbolism into his landscapes. Beyond art, he was a prominent advocate for Aboriginal self-determination, serving on the Central Land Council and working with the Northern Land Council in key native title negotiations. The Northern Territory Government named him a "Living Treasure." He died on 3 April 2005 in Alice Springs.',
      tribe: 'Western Arrernte',
      region: 'Hermannsburg (Ntaria), Northern Territory',
      birthYear: 1926,
      profileImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXt5zM4s-OCRQfj-msV1ban916wwZwbUtBAA&s',
    },
    // 6 ─ William Barak                      
    {
      name: 'William Barak',
      bio: 'William Barak (c.1824 – 15 August 1903) was a Wurundjeri-willam man of the Kulin nation, born at Brushy Creek (Yering) in the Yarra Valley, Victoria. He was the last ngurungaeta (head man) of the Wurundjeri-willam clan, and as a young man witnessed John Batman\'s 1835 treaty with the Kulin elders. Forced onto the Coranderrk station from the 1860s, he became a tireless advocate for his people\'s rights, leading petitions and delegations to the Victorian government. From the 1870s he produced a celebrated body of ceremonial drawings—corroboree scenes, figures in body paint, possum-skin cloaks, and traditional dances—executed in charcoal and ochre on paper and board. These works are among the earliest and most historically important examples of Indigenous Australian visual art. They are held at the National Gallery of Victoria, Museum Victoria, and the State Library of Victoria. All works are in the public domain. He died at Coranderrk on 15 August 1903.',
      tribe: 'Wurundjeri-willam (Kulin nation)',
      region: 'Yarra Valley, Victoria',
      birthYear: 1824,
      // Wikimedia Commons – public domain photograph of William Barak, 1902
      profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/William_Barak%2C_1902.jpg',
    },
    // 7 ─ Maggie Napangardi Watson
    {
      name: 'Maggie Napangardi Watson',
      bio: 'Maggie Napangardi Watson (c.1935– ) is a Warlpiri woman born at Mina Mina, near Lake Mackay in the Tanami Desert, Western Australia. She has spent most of her life in Yuendumu, Northern Territory, where she began painting in the 1980s as part of the Yuendumu art movement. Her paintings depict the Yam Vine (or Snake Vine/Liana) Dreaming, the ancestral paths of the bush yam that cross her traditional country. She renders these paths as dense, flowing networks of lines and dots across large canvases, combining ochre-coloured grounds with white and red patterning. Her works are held at the Musée du quai Branly in Paris and in numerous private collections. She is closely related to other prominent Warlpiri artists of Yuendumu.',
      tribe: 'Warlpiri',
      region: 'Tanami Desert / Yuendumu, Northern Territory',
      birthYear: 1935,
      profileImageUrl: 'https://static-assets.artlogic.net/w_1200,c_limit,f_auto,fl_lossy,q_auto/ws-artlogicwebsite1306/usr/images/artists/artist_image/items/7f/7f64dc493d164b928bc0d08d0d6b082f/maggie-portret-.jpeg',
    },
    // 8 ─ Mick Namarari Tjapaltjarri
    {
      name: 'Mick Namarari Tjapaltjarri',
      bio: 'Mick Namarari Tjapaltjarri (c.1926 – 24 February 1998) was a Pintupi painter born near the Pintupi homelands in the Western Desert, Northern Territory. He was one of the founding members of the Papunya Tula artists\' company, established in 1972 alongside Clifford Possum Tjapaltjarri and other Pintupi and Anmatyerre men under the encouragement of teacher Geoffrey Bardon. His paintings frequently depict Mouse Dreaming (Tjunginpa) and other Pintupi creation narratives, rendered in the distinctive dot-and-circle iconography of the Western Desert tradition. He participated in the founding dot-painting revolution from its very beginning and remained a central figure in Papunya Tula until his death. His works are held in the National Gallery of Australia, the National Gallery of Victoria, and the Musée du quai Branly in Paris. He died in Alice Springs on 24 February 1998.',
      tribe: 'Pintupi',
      region: 'Papunya / Kintore, Northern Territory',
      birthYear: 1926,
      profileImageUrl: 'https://cdn.shopify.com/s/files/1/0111/8362/products/Untitled-1_f104bb04-14b3-4602-8757-2275cc2dc061.jpg?v=1626848239',
    },
    // 9 ─ John Mawurndjul
    {
      name: 'John Mawurndjul',
      bio: 'John Mawurndjul AM (born 1952) is a Kuninjku bark painter from Maningrida in western Arnhem Land, Northern Territory. He is one of the most celebrated Aboriginal artists in Australia, internationally recognised for his masterful use of rarrk (cross-hatching) — a technique traditionally used in body decoration, hollow log coffins, and bark painting that encodes sacred Ancestral knowledge. His work depicts the spiritual beings of his Kuninjku country, above all the Ngalyod (Rainbow Serpent) and Yawkyawk (mermaid-like water spirits). His paintings were the subject of the major retrospective "John Mawurndjul: I Am the Old and the New" at the Art Gallery of New South Wales (2018–2019). He was awarded the Medal of the Order of Australia in 2004 and the full AM in 2018. Works held at the National Gallery of Australia, the Musée du quai Branly, the British Museum, and the Seattle Art Museum.',
      tribe: 'Kuninjku (Bininj Kunwok language group)',
      region: 'Arnhem Land, Northern Territory',
      birthYear: 1952,
      profileImageUrl: 'https://www.charlesnodrumgallery.com.au/assets/artwork/_resampled/ScaleWidthWyIxNDAwIl0-MAWURNDJUL.jpg',
    },
    // 10 ─ Bakulanay Marawili
    {
      name: 'Bakulanay Marawili',
      bio: 'Bakulanay Marawili is a Yolŋu bark painter of the Djambarbuyŋu clan from Yirrkala in North East Arnhem Land, Northern Territory. He works in the Munyuku tradition of sacred clan designs, using natural ochre pigments (red, yellow, white and black) on eucalyptus bark. His paintings depict the saltwater country of his ancestors, Dreaming beings, and the sacred cosmology of his clan. Yirrkala is the community that produced the famous 1963 Yirrkala Church Panels — the first formal petition by Aboriginal Australians to the Australian Parliament, incorporating traditional bark painting — after bauxite mining was announced on their land. His works are held at the Musée du quai Branly in Paris.',
      tribe: 'Djambarbuyŋu (Yolŋu people)',
      region: 'Yirrkala, Northern Territory',
      profileImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Autralia%2C_aborigeni%2C_bakulanay_marawili%2C_munyuku%2C_da_yirrkala%2C_territori_del_nord%2C_1996.JPG',
    },
  ])
  console.log(`Created ${artists.length} artists`)

  // ── 13 Artworks — every image confirmed to match the described work ────
  // Artists[1] (Emily Kame Kngwarreye) and artists[2] (Rover Thomas) have no
  // freely-licensed paintings on Wikimedia Commons and so have no artworks here.
  const artworks = await Artwork.insertMany([
    // ─ Albert Namatjira ───────────────────────────────────────────────────
    {
      title: 'Ghost Gum Trees, MacDonnell Ranges',
      description: 'A classic Namatjira landscape featuring the iconic white ghost gums against the vivid red and purple of the Central Australian ranges. Namatjira\'s mastery of European watercolour technique combined with an intimate knowledge of his Western Arrernte country produced a uniquely Australian style that captivated audiences around the world.',
      // Wikipedia EN — fair use. Confirmed Albert Namatjira watercolour landscape painting.
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/16/Namatjira_Landscape.jpg',
      medium: 'Watercolour on paper',
      year: 1950,
      artist: artists[0]._id,
      tags: ['landscape', 'watercolour', 'Central Australia', 'ghost gum'],
    },
    // ─ Clifford Possum Tjapaltjarri ───────────────────────────────────────
    {
      title: 'Warlugulong',
      description: 'One of the most important works in Australian art history, now in the National Gallery of Australia. This monumental 2 × 3.3 m canvas depicts the Dreaming story of Lungkata the Bluetongue Lizard Man who started the first bushfire to punish his sons, together with eight other Dreamings mapped across the artist\'s country. Sold at Sotheby\'s in 2007 for A$2.4 million — then a record for Aboriginal art.',
      // Wikipedia EN — fair use. Confirmed detail of Warlugulong (1977) by Clifford Possum, National Gallery of Australia.
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Warlugulong_-_Zoom.png',
      medium: 'Synthetic polymer paint on canvas',
      year: 1977,
      artist: artists[3]._id,
      tags: ['dot painting', 'Dreamtime', 'Papunya Tula', 'songlines'],
    },
    // ─ Minnie Pwerle ──────────────────────────────────────────────────────
    {
      title: "Awelye — Women's Ceremony",
      description: "Minnie Pwerle's signature subject: Awelye, the women's body-paint ceremony that is the centrepiece of Anmatyerre ceremonial life. Bold, sweeping arcs of deep red and purple surge across the canvas, recalling the curves painted on women's torsos during ceremony. Despite beginning to paint in her late eighties, she produced some of the most energetic works in Australian art. Photograph shows Pwerle with one of her Awelye canvases.",
      // Wikipedia EN — fair use. Confirmed: Minnie Pwerle photographed with her actual Awelye painting.
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2f/Minnie_Pwerle_painting.JPG',
      medium: 'Acrylic on canvas',
      year: 2000,
      artist: artists[4]._id,
      tags: ['ceremony', 'Anmatyerre', 'women', 'acrylic', 'Utopia'],
    },
    // ─ Wenten Rubuntja ────────────────────────────────────────────────────
    {
      title: 'Black Snake Dreaming',
      description: 'A large-format acrylic by Wenten Rubuntja, Central Australia, 1978. Rubuntja was trained in the European watercolour tradition of the Hermannsburg School but this work integrates Arrernte ceremonial symbolism into a bold acrylic composition. The serpentine forms across the canvas evoke the Black Snake Dreaming track that runs through his country near Alice Springs.',
      // Wikimedia Commons CC BY-SA 4.0. Confirmed: "Black Snake Dreaming. Wenten Rubuntja. Central Australia. 1978."
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Black_Snake_Dreaming._Wenten_Rubuntja._Central_Australia._1978.jpg',
      medium: 'Acrylic on canvas',
      year: 1978,
      artist: artists[5]._id,
      tags: ['snake', 'Dreaming', 'Arrernte', 'Hermannsburg', 'acrylic'],
    },
    // ─ William Barak — three confirmed public-domain drawings ─────────────
    {
      title: 'Ceremony (1897)',
      description: 'One of William Barak\'s most celebrated works — a detailed depiction of a traditional Kulin corroboree with figures in full body-paint arrangement. Barak was the last ngurungaeta (head man) of the Wurundjeri-willam clan and these ceremonial drawings are among the earliest and most important examples of Indigenous Australian visual art. Held at the National Gallery of Victoria.',
      // Wikimedia Commons — public domain (artist died 1903). Confirmed: \'Ceremony\' by William Barak, 1897, NGV.
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/%27Ceremony%27_by_William_Barak%2C_1897.jpg",
      medium: 'Charcoal and ochre on paper',
      year: 1897,
      artist: artists[6]._id,
      tags: ['corroboree', 'ceremony', 'Wurundjeri', 'Victoria', 'public domain'],
    },
    {
      title: 'Ceremony (1900)',
      description: 'A second ceremonial work made three years before Barak\'s death. The composition shows communal figures assembled for ritual, their bodies marked with ceremonial designs. Painted at Coranderrk Station, the work encodes Wurundjeri culture at a time when forced assimilation policies threatened to erase it. Held at the National Gallery of Victoria.',
      // Wikimedia Commons — public domain. Confirmed: "William Barak, Ceremony (1900)", NGV.
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/66/William_Barak%2C_Ceremony_%281900%29.jpg',
      medium: 'Charcoal and ochre on paper',
      year: 1900,
      artist: artists[6]._id,
      tags: ['corroboree', 'ceremony', 'Wurundjeri', 'Victoria', 'public domain'],
    },
    {
      title: 'Figures in Possum Skin Cloaks',
      description: 'Barak depicts Kulin people wearing possum-skin cloaks — garments central to Wurundjeri material culture that were being suppressed by colonial officials by the time this drawing was made in 1898. The work is an act of cultural memory and resistance. Digitised via the Google Art Project from the National Gallery of Victoria. Public domain.',
      // Wikimedia Commons — public domain (Google Art Project). Confirmed: William Barak, 1898, NGV.
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/William_Barak_-_Figures_in_possum_skin_cloaks_-_Google_Art_Project.jpg',
      medium: 'Charcoal and ochre on paper',
      year: 1898,
      artist: artists[6]._id,
      tags: ['possum-skin cloak', 'Wurundjeri', 'Victoria', 'public domain', 'cultural memory'],
    },
    // ─ Maggie Napangardi Watson — three views of the 1990–91 series ────────
    {
      title: 'Snake Vine Dreaming',
      description: 'A large canvas in deep ochre, white, and red depicting the Snake Vine Dreaming that crosses Maggie Napangardi Watson\'s country near Lake Mackay. The sinuous vine pathways are rendered in an intricate network of flowing lines and dots, encoding the ancestral geography of the Tanami Desert. Held at the Musée du quai Branly, Paris.',
      // Wikimedia Commons CC BY-SA 3.0 — Confirmed: Maggie Napangardi Watson, Snake Vine Dreaming, Central Desert, 1990–91 (photo: Sailko, Musée du quai Branly, 2013).
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Australia%2C_aborigeni%2C_maggie_napangardi_watson%2C_sogno_della_liana-serpente%2C_deserto_centrale%2C_1990-91%2C_01.JPG',
      medium: 'Acrylic on canvas',
      year: 1990,
      artist: artists[7]._id,
      tags: ['Dreaming', 'Warlpiri', 'yam vine', 'Tanami', 'acrylic'],
    },
    {
      title: 'Snake Vine Dreaming II',
      description: "The second panel in Watson's 1990–91 Snake Vine Dreaming series at the Musée du quai Branly. A closely related but distinct composition — the vine paths shift in rhythm and colour balance, demonstrating the Warlpiri practice of revisiting a Dreaming story across multiple canvases to explore its different aspects and geographical extent.",
      // Wikimedia Commons CC BY-SA 3.0 — Confirmed: Maggie Napangardi Watson, Snake Vine Dreaming, Central Desert, 1990–91 (photo: Sailko, Musée du quai Branly, 2013).
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Australia%2C_aborigeni%2C_maggie_napangardi_watson%2C_sogno_della_liana-serpente%2C_deserto_centrale%2C_1990-91%2C_02.JPG',
      medium: 'Acrylic on canvas',
      year: 1991,
      artist: artists[7]._id,
      tags: ['Dreaming', 'Warlpiri', 'yam vine', 'Tanami', 'acrylic'],
    },
    {
      title: 'Snake Vine Dreaming III',
      description: "The third panel in Watson's 1990–91 series. Each canvas presents the Dreaming as a living, shifting force — the vine ancestor's paths change slightly in each telling, reflecting the oral tradition's flexibility and the artist's deep personal connection to her country.",
      // Wikimedia Commons CC BY-SA 3.0 — Confirmed: Maggie Napangardi Watson, Snake Vine Dreaming, Central Desert, 1990–91 (photo: Sailko, Musée du quai Branly, 2013).
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Australia%2C_aborigeni%2C_maggie_napangardi_watson%2C_sogno_della_liana-serpente%2C_deserto_centrale%2C_1990-91%2C_03.JPG',
      medium: 'Acrylic on canvas',
      year: 1991,
      artist: artists[7]._id,
      tags: ['Dreaming', 'Warlpiri', 'yam vine', 'Tanami', 'acrylic'],
    },
    // ─ Mick Namarari Tjapaltjarri ─────────────────────────────────────────
    {
      title: 'Tjunginpa Dreaming',
      description: 'A 1996 work depicting the Tjunginpa (Mouse) Dreaming, one of the creation stories associated with the country north-west of Kintore. Mick Namarari Tjapaltjarri was one of the founding members of Papunya Tula Artists (1972) and brought the Mouse Dreaming into the canon of Western Desert art. The dense dot-work shows a painter at full command of his medium. Held at the Musée du quai Branly, Paris.',
      // Wikimedia Commons CC BY-SA 3.0 — Confirmed: Mick Namarari Tjapaltjarri, Tjunginpa Dreaming, 1996 (photo: Sailko, Musée du quai Branly, 2013).
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Australia%2C_aborigeni%2C_mick_namarari_tjapaltjarri%2C_sogno_di_tjunginpa_a_tjunginpa%2C_nord-ovest_di_kintore%2C_da_papunya%2C_1996.JPG',
      medium: 'Synthetic polymer paint on canvas',
      year: 1996,
      artist: artists[8]._id,
      tags: ['dot painting', 'Dreamtime', 'Pintupi', 'Papunya Tula', 'mouse'],
    },
    // ─ John Mawurndjul ────────────────────────────────────────────────────
    {
      title: 'Ngalyod — Rainbow Serpent',
      description: "A masterwork of rarrk (cross-hatching) from 1991, depicting Ngalyod the Rainbow Serpent — the most powerful creator being in western Arnhem Land cosmology. John Mawurndjul's intricate filaments of hatching encode sacred knowledge about this being's movements through the waterholes and billabongs of his Kuninjku country. The horns identify this as a crowned rainbow serpent. Held at the Musée du quai Branly, Paris.",
      // Wikimedia Commons CC BY-SA 3.0 — Confirmed: John Mawurndjul, Rainbow Serpent, 1991 (photo: Sailko, Musée du quai Branly, 2013).
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Australia%2C_arte_aborigena%2C_john_mawurndjul%2C_serprente_arcobaleno_cornuto%2C_1991.JPG',
      medium: 'Natural pigments on eucalyptus bark',
      year: 1991,
      artist: artists[9]._id,
      tags: ['bark painting', 'Arnhem Land', 'rainbow serpent', 'rarrk', 'Kuninjku'],
    },
    // ─ Bakulanay Marawili ─────────────────────────────────────────────────
    {
      title: 'Munyuku Saltwater Dreaming',
      description: "A bark painting from 1996 using natural ochre pigments on eucalyptus bark, depicting the sacred saltwater country and Dreaming beings of the Djambarbuyŋu (Munyuku) clan. Yirrkala, where Bakulanay Marawili lives and works, is the community that in 1963 created the Yirrkala Church Panels — the first formal petition by Aboriginal Australians to the Commonwealth Parliament. Held at the Musée du quai Branly, Paris.",
      // Wikimedia Commons CC BY-SA 3.0 — Confirmed: Bakulanay Marawili, Munyuku, Yirrkala, 1996 (photo: Sailko, Musée du quai Branly, 2013).
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Autralia%2C_aborigeni%2C_bakulanay_marawili%2C_munyuku%2C_da_yirrkala%2C_territori_del_nord%2C_1996.JPG',
      medium: 'Natural ochre pigments on eucalyptus bark',
      year: 1996,
      artist: artists[10]._id,
      tags: ['bark painting', 'Arnhem Land', 'Yolŋu', 'saltwater', 'Yirrkala'],
    },
  ])
  console.log(`Created ${artworks.length} artworks`)

  console.log('\nSeed complete!')

  await mongoose.connection.close()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})