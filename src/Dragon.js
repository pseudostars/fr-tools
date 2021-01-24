const cheerio = require('cheerio');
const moment = require('moment');
const BREEDS = require('@/data/breeds');

function Dragon(data) {
  return {
    data,
    id() {
      return this.data.id;
    },
    name() {
      return this.data.name;
    },
    displayName() {
      return `${this.name()}#${this.id()}`;
    },
    gender() {
      return this.data.gender;
    },
    breed() {
      return this.data.breed;
    },
    flight() {
      return this.data.flight;
    },
    eyes() {
      return this.data.eyes;
    },
    primaryColor() {
      return this.data.primaryColor;
    },
    primaryGene() {
      return this.data.primaryGene;
    },
    secondaryColor() {
      return this.data.secondaryColor;
    },
    secondaryGene() {
      return this.data.secondaryGene;
    },
    tertiaryColor() {
      return this.data.tertiaryColor;
    },
    tertiaryGene() {
      return this.data.tertiaryGene;
    },
    dateOfBirth() {
      return this.data.dateOfBirth;
    },
    isBred() {
      return this.data.isBred;
    },
    isAncient() {
      return BREEDS.find(x => x.name === this.breed()).is_ancient;
    },
    hasSilhouette() {
      return this.data.hasSilhouette;
    },
    isPermababy() {
      return this.data.isPermababy;
    },
    thumbnailImageUrl() {
      return `https://www1.flightrising.com/rendern/avatars/${Math.ceil(this.data.id / 100)}/${this.data.id}.png`;
    },
    colorPattern() {
      return colorPattern(this.data.primaryColor, this.data.secondaryColor, this.data.tertiaryColor);
    },
    digits() {
      return Math.ceil(Math.log(this.data.id) / Math.log(10));
    },
    tags() {
      return this.data.tags;
    },
    hasTag(tag) {
      return this.data.tags.includes(tag);
    },
    pushTag(tag) {
      if (!this.data.tags) this.data.tags = [];
      this.data.tags.push(tag);
    },
    removeTag(idx) {
      if (this.data.tags) this.data.tags = [...this.data.tags.slice(0, idx), ...this.data.tags.slice(idx+1)];
    },
  };
}

function importDragonFromDragonBlob($) {
  const stat = (index, take_first) => {
    const item = $('.dragon-profile-stat-icon-value')[index];
    return take_first ? $(item).html().split('<br>')[0].trim() : $('strong', item).html();
  };

  return Dragon({
    id: parseInt($('meta[property="og:url"]').attr('content').split('/')[4]),
    name: $('.dragon-profile-header-name').html(),
    gender: $('#dragon-profile-icon-sex-tooltip strong').html(),
    isFirstGen: !$('.dragon-profile-lineage-parents a')[0],
    isBred: !!$('.dragon-profile-lineage-offspring a')[0],
    hasSilhouette: !!$('#dragon-profile-icon-silhouette-tooltip')[0],
    isPermababy: !!$('#dragon-profile-icon-eternal-youth-tooltip')[0],
    primaryColor: stat(0, true),
    primaryGene: stat(0, false),
    secondaryColor: stat(1, true),
    secondaryGene: stat(1, false),
    tertiaryColor: stat(2, true),
    tertiaryGene: stat(2, false),
    breed: stat(4, false),
    flight: stat(5, true),
    eyes: stat(5, false),
    dateOfBirth: moment($('strong', stat(3, true)).html(), 'MMM DD, YYYY').format('YYYY-MM-DD'),
    tags: [],
  });
}

function importDragonsFromLairBlob($) {
  return $('.lair-page-dragon').map((i) => importDragonFromLairBlob($, $('.lair-page-dragon').eq(i))).toArray();
}

function importDragonFromLairBlob($, det) {
  const tipId = $('.lair-page-dragon-tumbnail', det).attr('rel');
  const tip = $(tipId);

  console.log($('[data-tooltip-source="#icon-eternal-youth-tooltip"]', det).length);
  return Dragon({
    id: parseInt(tipId.split('-')[1]),
    name: $('div', tip).eq(1).text(),
    gender: $('div', tip).eq(2).text().split(' ')[1],
    isFirstGen: $('span', tip).eq(2).text() === 'First Generation',
    isBred: null,
    hasSilhouette: !!$('[data-tooltip-source="#icon-silhouette-tooltip"]', det)[0],
    isPermababy: !!$('[data-tooltip-source="#icon-eternal-youth-tooltip"]', det)[0],
    primaryColor: $('div', tip).eq(8).text().split(' ')[2],
    primaryGene: $('div', tip).eq(8).text().split(' ')[3],
    secondaryColor: $('div', tip).eq(9).text().split(' ')[2],
    secondaryGene: $('div', tip).eq(9).text().split(' ')[3],
    tertiaryColor: $('div', tip).eq(10).text().split(' ')[2],
    tertiaryGene: $('div', tip).eq(10).text().split(' ')[3],
    breed: $('div', tip).eq(2).text().split(' ')[0],
    flight: $('div', tip).eq(11).text().split(' ')[2],
    eyes: $('div', tip).eq(11).text().split(' ')[3],
    dateOfBirth: null,
    tags: [],
  });
};

function colorPattern(prim, sec, tert) {
  if (prim === sec && prim === tert) return 'XXX';
  if (prim === sec && prim !== tert) return 'XXY';
  if (prim !== sec && sec === tert) return 'XYY';
  if (prim === tert && prim !== sec) return 'XYX';
  return 'XYZ';
}

module.exports = {
  Dragon,
  dragonLookup: (payload) => {
    const $ = cheerio.load(payload);
    let dragons = [];

    if ($('#error-404')[0]) {
      return null;
    } else if ($('meta[property="og:url"]')[0] && $('meta[property="og:url"]').attr('content').substr(0, 37) === 'https://www1.flightrising.com/dragon/') {
      dragons.push(importDragonFromDragonBlob($));
    } else if ($('#lair-view-page')[0]) {
      dragons = dragons.concat(importDragonsFromLairBlob($));
    } else {
      return null;
    }

    return dragons;
  },
};