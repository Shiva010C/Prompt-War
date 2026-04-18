export default function FoodStands({ setActiveMenu }) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-headline font-black uppercase italic tracking-tighter text-white">Food Stands</h3>
        <div className="flex gap-2">
          <div className="bg-tertiary-container text-on-tertiary-container text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Open Now</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Food Card 1 */}
        <div className="bg-surface-container-low rounded-3xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300">
          <div className="h-40 overflow-hidden relative">
            <img loading="lazy" decoding="async" alt="The Burger Joint" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_k4MS5XaC2uol8F9plPYskfMURqCwTndxkKjfqQi4FrwGN7RIR9TOxnV4qnYcJhcWxf9oGK74To0kKgGVKrbg1etn-VvU7xfWVDRmtf3EXrFzcO9FH2-U_bhoT4cMxern2CkyQ049SR273A2fp-Wm9IIhkrbBiqZ8HspIKmcUitlNlHvQxTXgUD7JayyQ0wH2RvNgSTgustRDom7lVfY3Q2qREnsb1FqFk-z0_dgNr3t2xSjgT0a071MmuJt4BWtF-42p0EMYLSTd"/>
            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-tertiary text-xs" aria-hidden="true" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
              <span className="text-xs font-bold text-white">4.8</span>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h4 className="font-headline font-bold text-lg text-white">The Burger Joint</h4>
              <p className="text-xs text-slate-400">Artisan beef, plant-based options</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Burgers</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Fries</span>
            </div>
            <button 
              onClick={() => setActiveMenu('The Burger Joint')}
              className="w-full py-3 bg-surface-container-highest text-primary font-bold rounded-xl uppercase text-[10px] tracking-widest hover:bg-primary hover:text-on-primary active:scale-95 transition-all"
            >
              View Menu
            </button>
          </div>
        </div>

        {/* Food Card 2 */}
        <div className="bg-surface-container-low rounded-3xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300 border border-transparent hover:border-primary/20">
          <div className="h-40 overflow-hidden relative" >
            <img loading="lazy" decoding="async" alt="Stadium Classics Hot Dogs" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB52BaJld7D7vc6QBcY3AZw-QJRuOqq1AmpqCjxGS7H_SFZvL2GLDfX-zeuzvgXhqES9wJnjiVITSq9D_vnKeC2cT4wQspTI__TUA5EdaGrgJMZG8mfT1YLjt2DQ92NgMjwkwWGdfatp1Ats4kzaBhoUyWQ6Km9a1hRgWPjYmxZmp70vPYscVGS_tnwnYcs0k7q6lDL1JfxXlWFC14lHJPmLgiLaGZ3FK07tEB4uzEFDxnDXqBokcE7JHHlv24lxi9OuN4V9DRWnSV"/>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h4 className="font-headline font-bold text-lg text-white">Stadium Classics</h4>
              <p className="text-xs text-slate-400">Footlong dogs, Pretzels, Nachos</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Hot Dogs</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Snacks</span>
            </div>
            <button 
              onClick={() => setActiveMenu('Stadium Classics')}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-black rounded-xl uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Select Items
            </button>
          </div>
        </div>

        {/* Food Card 3 */}
        <div className="bg-surface-container-low rounded-3xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300">
          <div className="h-40 overflow-hidden relative">
            <img loading="lazy" decoding="async" alt="Brick Oven Pizza" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHxdj8TfG_v84bPXrr1nlekAgBkb29HRYnuaEURko0s1MTHMHLvVb5hyvj8A0mMqv2YTNlRa2SdYIabp50gM0FyBuRP1epzJaLB89eYREL5_1nP8js2QJUHPndoQvlY7YVlpgm6HhcO0ZeDfl-Y9qb3Vpa4l7Hjkt4442JfNW7RSold6paeHN6JzlLq5IbYO7necM_HnTpUAIVrUpsmDf1rMTO5lL-FUFs6LT07MtqlDnABLBaiG5DU27nOz5ekkjtQYjErh4nBnmG"/>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h4 className="font-headline font-bold text-lg text-white">Brick Oven Pizza</h4>
              <p className="text-xs text-slate-400">Traditional wood-fired slices</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Pizza</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Vegan</span>
            </div>
            <button 
              onClick={() => setActiveMenu('Brick Oven Pizza')}
              className="w-full py-3 bg-surface-container-highest text-primary font-bold rounded-xl uppercase text-[10px] tracking-widest hover:bg-primary hover:text-on-primary active:scale-95 transition-all"
            >
              View Menu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
