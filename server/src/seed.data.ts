import { VisitWay } from './visits/visit.schema.js';

export const PEOPLE = [
  'Mira Chen',
  'Jonas Hale',
  'Adele Voss',
  'Samir Okonkwo',
  'Wren Patel',
] as const;

export const SITES: {
  address: string;
  title: string;
  author: string;
  body: string;
}[] = [
  {
    address: 'tidepool.zz',
    title: 'Low Tide Notes',
    author: 'Mira Chen',
    body: `<h1>Low Tide Notes</h1>
<p>When the water leaves, the rocks keep a small museum. Anemones close like fists. A crab waits under a blade of <a href="kelp.zz">kelp</a>.</p>
<p>I walk the same shelf every morning and write what is new. Today a glass float sat in a crack, still salt-wet, with a tag that pointed to the <a href="ferry.zz">ferry slip</a>.</p>
<p>If the tide is out, the <a href="lighthouse.zz">lighthouse</a> looks closer than it is. If you want yesterday's weather, it is not here. Try <a href="nowhere.zz">nowhere.zz</a>.</p>`,
  },
  {
    address: 'kelp.zz',
    title: 'A Field Guide to Kelp',
    author: 'Mira Chen',
    body: `<h1>A Field Guide to Kelp</h1>
<p>Kelp is not one plant. It is a forest that lies down when the swell is hard and stands when the water is kind.</p>
<p>Hold a blade to the light and you will see the veins that feed the tips. The holdfast is the root that is not a root. It grips stone and does not drink soil.</p>
<p>Start at <a href="tidepool.zz">tidepool.zz</a> if you want the shore. The keeper at <a href="lighthouse.zz">lighthouse.zz</a> swears the beds run all the way under the channel.</p>`,
  },
  {
    address: 'recipes.zz',
    title: 'Bread for Foggy Mornings',
    author: 'Mira Chen',
    body: `<h1>Bread for Foggy Mornings</h1>
<p>This loaf does not mind the weather. Mix flour, water, salt, and a spoon of yesterday's dough. Leave it on the sill while the <a href="ferry.zz">ferry</a> makes its first run.</p>
<p>Bake until the crust sounds like a door knock. Eat it with butter and whatever the <a href="tidepool.zz">pools</a> gave up, if they gave up anything.</p>
<p>I keep a note on the back of the tin: if the dough will not rise, walk to <a href="harbor.zz">harbor.zz</a> and borrow warmth from the tea stall.</p>`,
  },
  {
    address: 'lighthouse.zz',
    title: "The Keeper's Log",
    author: 'Jonas Hale',
    body: `<h1>The Keeper's Log</h1>
<p>The lamp is not romantic. It is a chore with a clock. Glass, wick, wind, repeat.</p>
<p>Fog came in after noon and hid the <a href="ferry.zz">ferry</a> until the horn did the talking. The channel markers were gone. I wrote the time twice to be sure.</p>
<p>For the shore path see <a href="tidepool.zz">tidepool.zz</a>. For the day's sky see <a href="weather.zz">weather.zz</a>. The old <a href="foghorn.zz">foghorn page</a> is still linked from my notes. I have not found it in years.</p>`,
  },
  {
    address: 'ferry.zz',
    title: 'Crossing Times',
    author: 'Jonas Hale',
    body: `<h1>Crossing Times</h1>
<p>The boat leaves when the ramp is clear, not when the printed card says so. Still, people stand in a line as if paper could hold the tide.</p>
<p>Morning run hugs the <a href="lighthouse.zz">light</a>. Afternoon run cuts closer to the <a href="harbor.zz">harbor wall</a>. If the swell is ugly we turn back and nobody argues for long.</p>
<p>Tickets are a stamp and a name. Bring coins. The office listed at <a href="oldpier.zz">oldpier.zz</a> closed last winter.</p>`,
  },
  {
    address: 'maps.zz',
    title: 'A Pocket Map of the Channel',
    author: 'Jonas Hale',
    body: `<h1>A Pocket Map of the Channel</h1>
<p>North is the light. South is the town. Between them the water changes its mind.</p>
<p>I drew this from the wheelhouse window: kelp dark in the shallows, a pale bar where the sand rises, a notch that is the <a href="harbor.zz">harbor mouth</a>.</p>
<p>Do not trust the pencil line near the rocks. Walk the <a href="tidepool.zz">shelf</a> instead, or ask at <a href="lighthouse.zz">lighthouse.zz</a> before you take a small boat out.</p>`,
  },
  {
    address: 'weather.zz',
    title: 'Sky Over the Channel',
    author: 'Wren Patel',
    body: `<h1>Sky Over the Channel</h1>
<p>Today: low cloud, a thin rain that does not quite fall, wind from the west that smells like wet rope.</p>
<p>The <a href="lighthouse.zz">keeper</a> rang once at dawn. Visibility is a guess. If you are walking the shore, the stones will be slick.</p>
<p>Tomorrow may clear. I will write it here either way. The <a href="nightwatch.zz">night watch</a> keeps the later hours.</p>`,
  },
  {
    address: 'nightwatch.zz',
    title: 'Hours After Dark',
    author: 'Wren Patel',
    body: `<h1>Hours After Dark</h1>
<p>After the last <a href="ferry.zz">crossing</a> the channel goes quiet except for the lamp and the radio.</p>
<p>I drink tea and count the seconds between flashes. When the fog is thick the light feels like it is inside the room.</p>
<p>If you are still awake, yesterday's sky is on <a href="weather.zz">weather.zz</a>. The town windows go dark in a line from the <a href="harbor.zz">harbor</a> up the hill.</p>`,
  },
  {
    address: 'harbor.zz',
    title: 'Along the Wall',
    author: 'Samir Okonkwo',
    body: `<h1>Along the Wall</h1>
<p>Nets dry on the capstones. Someone left a crate of oranges and a handwritten price. Gulls have an opinion about this.</p>
<p>The tea stall opens when the <a href="ferry.zz">boat</a> is due, not before. Sit with your back to the wind. Watch the <a href="maps.zz">channel</a> pretend it is still.</p>
<p>I walk from here to the <a href="tidepool.zz">pools</a> when the work is done. If you need bread, Mira posted a loaf at <a href="recipes.zz">recipes.zz</a>.</p>`,
  },
  {
    address: 'postbox.zz',
    title: 'Notices and Lost Things',
    author: 'Adele Voss',
    body: `<h1>Notices and Lost Things</h1>
<p>A grey scarf on the <a href="ferry.zz">ramp</a>. A tin cup by the <a href="lighthouse.zz">steps</a>. A child looking for a wooden boat with a red sail.</p>
<p>Pin what you have lost. Pin what you have found. I sweep the old notes on Sundays.</p>
<p>Someone left this in the last notice. I kept it because the page should show what people actually send:</p>
<script>alert('leave this page')</script>
<p>If you are wandering, start at <a href="tidepool.zz">tidepool.zz</a> and follow the links until you are hungry.</p>`,
  },
];

export const VISITS: {
  person: string;
  address: string;
  via: VisitWay;
  minutes: number;
}[] = [
  { person: 'Adele Voss', address: 'tidepool.zz', via: 'typed', minutes: 0 },
  { person: 'Adele Voss', address: 'kelp.zz', via: 'link', minutes: 3 },
  { person: 'Adele Voss', address: 'lighthouse.zz', via: 'link', minutes: 6 },
  { person: 'Adele Voss', address: 'weather.zz', via: 'link', minutes: 9 },
  { person: 'Adele Voss', address: 'lighthouse.zz', via: 'back', minutes: 11 },
  { person: 'Adele Voss', address: 'weather.zz', via: 'forward', minutes: 13 },
  { person: 'Adele Voss', address: 'ferry.zz', via: 'typed', minutes: 16 },
  { person: 'Adele Voss', address: 'harbor.zz', via: 'link', minutes: 19 },
  { person: 'Adele Voss', address: 'maps.zz', via: 'link', minutes: 22 },
  { person: 'Adele Voss', address: 'recipes.zz', via: 'search', minutes: 26 },
  { person: 'Adele Voss', address: 'nightwatch.zz', via: 'typed', minutes: 30 },
  { person: 'Adele Voss', address: 'postbox.zz', via: 'typed', minutes: 34 },
  { person: 'Adele Voss', address: 'nowhere.zz', via: 'typed', minutes: 38 },
  { person: 'Adele Voss', address: 'tidepool.zz', via: 'history', minutes: 42 },
  { person: 'Adele Voss', address: 'kelp.zz', via: 'typed', minutes: 48 },

  { person: 'Jonas Hale', address: 'lighthouse.zz', via: 'typed', minutes: 5 },
  { person: 'Jonas Hale', address: 'ferry.zz', via: 'link', minutes: 12 },
  { person: 'Jonas Hale', address: 'harbor.zz', via: 'link', minutes: 18 },
  { person: 'Jonas Hale', address: 'ferry.zz', via: 'back', minutes: 21 },
  { person: 'Jonas Hale', address: 'maps.zz', via: 'typed', minutes: 40 },

  { person: 'Samir Okonkwo', address: 'harbor.zz', via: 'typed', minutes: 8 },
  { person: 'Samir Okonkwo', address: 'tidepool.zz', via: 'link', minutes: 15 },
  { person: 'Samir Okonkwo', address: 'kelp.zz', via: 'link', minutes: 20 },
  { person: 'Samir Okonkwo', address: 'weather.zz', via: 'search', minutes: 33 },

  { person: 'Wren Patel', address: 'weather.zz', via: 'typed', minutes: 2 },
  { person: 'Wren Patel', address: 'lighthouse.zz', via: 'link', minutes: 14 },
  { person: 'Wren Patel', address: 'nightwatch.zz', via: 'typed', minutes: 50 },

  { person: 'Mira Chen', address: 'recipes.zz', via: 'typed', minutes: 7 },
  { person: 'Mira Chen', address: 'tidepool.zz', via: 'typed', minutes: 28 },
  { person: 'Mira Chen', address: 'kelp.zz', via: 'link', minutes: 36 },
];
