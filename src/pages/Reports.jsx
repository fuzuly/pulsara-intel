import { useState } from 'react';
import { Download, FileSpreadsheet, Presentation, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import { useExport } from '../hooks/useExport';
import clsx from 'clsx';

const REPORT_SECTIONS = [
  { id: 'kpi', label: 'Genel KPI Özeti', desc: 'Aylık ciro, sipariş, NPS verileri', sheets: 1, icon: '📊' },
  { id: 'competitor', label: 'Rakip Analizi', desc: '20 marka tam karşılaştırma matrisi', sheets: 1, icon: '🏆' },
  { id: 'menu', label: 'Menü Karşılaştırması', desc: '19 ürün fiyat matrisi', sheets: 1, icon: '🍽️' },
  { id: 'sales', label: 'Satış Analizi', desc: 'Aylık, haftalık satış verileri + top ürünler', sheets: 2, icon: '📈' },
  { id: 'social', label: 'Sosyal Medya', desc: '5 platform, 11 marka metrikleri', sheets: 1, icon: '📱' },
  { id: 'osint', label: 'OSINT Raporları', desc: 'Web mentions + duygu analizi', sheets: 2, icon: '🛰️' },
];

const PPTX_SLIDES = [
  { id: 1, label: 'Kapak Slaytı', icon: '🎯' },
  { id: 2, label: 'KPI Özeti (6 Metrik)', icon: '📊' },
  { id: 3, label: 'Pazar Payı Tablosu', icon: '🥧' },
  { id: 4, label: 'Rakip Skor Karşılaştırması', icon: '🏆' },
  { id: 5, label: 'Sosyal Medya Performansı', icon: '📱' },
  { id: 6, label: 'Yeni Ürünler (Son 30 Gün)', icon: '🆕' },
  { id: 7, label: 'OSINT Duygu Analizi', icon: '🛰️' },
  { id: 8, label: 'Kapanış Slaytı', icon: '👋' },
];

export default function Reports() {
  const [selectedSections, setSelectedSections] = useState(REPORT_SECTIONS.map(s => s.id));
  const [excelDone, setExcelDone] = useState(false);
  const [pptxDone, setPptxDone] = useState(false);
  const { exportToExcel, exportToPPTX, isExporting, exportType, error } = useExport();

  const toggleSection = (id) => {
    setSelectedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleExcel = async () => {
    try {
      await exportToExcel({ sections: selectedSections });
      setExcelDone(true);
      setTimeout(() => setExcelDone(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePPTX = async () => {
    try {
      await exportToPPTX({});
      setPptxDone(true);
      setTimeout(() => setPptxDone(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const totalSheets = REPORT_SECTIONS
    .filter(s => selectedSections.includes(s.id))
    .reduce((acc, s) => acc + s.sheets, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Raporlar & Dışa Aktarım"
        subtitle="Excel ve PowerPoint formatında profesyonel raporlar indirin"
      />

      {/* Report config */}
      <div className="card">
        <h3 className="text-base font-semibold text-white mb-4">Rapor İçeriği Seçin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {REPORT_SECTIONS.map(section => {
            const selected = selectedSections.includes(section.id);
            return (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={clsx(
                  'flex items-start gap-3 p-3 rounded-xl border text-left transition-all',
                  selected
                    ? 'border-caramel/50 bg-caramel/10'
                    : 'border-navy-border bg-surface2/30 hover:border-navy-border/80'
                )}
              >
                <div className={clsx(
                  'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all',
                  selected ? 'border-caramel bg-caramel' : 'border-muted'
                )}>
                  {selected && <CheckCircle size={12} className="text-espresso" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{section.icon}</span>
                    <span className={clsx('text-sm font-medium', selected ? 'text-white' : 'text-muted')}>
                      {section.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{section.desc}</p>
                  <p className="text-[10px] text-muted mt-1">{section.sheets} sayfa/sekme</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-navy-border">
          <p className="text-sm text-muted">
            <strong className="text-white">{selectedSections.length}</strong> bölüm seçildi →{' '}
            <strong className="text-white">{totalSheets + 2}</strong> Excel sayfası
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSections(REPORT_SECTIONS.map(s => s.id))}
              className="btn-ghost text-xs"
            >
              Tümünü Seç
            </button>
            <button
              onClick={() => setSelectedSections([])}
              className="btn-ghost text-xs"
            >
              Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-3 bg-danger/10 border border-danger/30 rounded-xl p-4">
          <AlertCircle size={16} className="text-danger" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {/* Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Excel Card */}
        <div className="card border-success/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-success to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet size={24} className="text-success" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Excel Raporu</h3>
              <p className="text-xs text-muted">.xlsx — Microsoft Excel formatı</p>
            </div>
          </div>

          <div className="space-y-1.5 mb-5">
            <p className="text-xs text-muted font-medium mb-2">İçerik:</p>
            {[
              `${selectedSections.length} seçili bölüm`,
              `${totalSheets + 2} Excel sayfası`,
              'Otomatik filtreli tablolar',
              'Türkçe sayı/tarih formatı',
              'Hücre renk kodlaması',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs text-white">
                <CheckCircle size={12} className="text-success flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <button
            onClick={handleExcel}
            disabled={isExporting || selectedSections.length === 0}
            className={clsx(
              'w-full btn text-sm font-semibold py-3 justify-center transition-all',
              excelDone
                ? 'bg-success/20 text-success border border-success/30'
                : 'bg-success/20 text-success border border-success/30 hover:bg-success/30 disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isExporting && exportType === 'excel' ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Hazırlanıyor...
              </>
            ) : excelDone ? (
              <>
                <CheckCircle size={16} />
                İndirildi!
              </>
            ) : (
              <>
                <Download size={16} />
                Excel İndir (.xlsx)
              </>
            )}
          </button>

          <p className="text-[10px] text-muted mt-2 text-center">
            Dosya adı: Rekabet_Raporu_{new Date().toISOString().split('T')[0]}.xlsx
          </p>
        </div>

        {/* PPTX Card */}
        <div className="card border-info/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-info to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center flex-shrink-0">
              <Presentation size={24} className="text-info" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">PowerPoint Sunumu</h3>
              <p className="text-xs text-muted">.pptx — Microsoft PowerPoint formatı</p>
            </div>
          </div>

          <div className="space-y-1.5 mb-5">
            <p className="text-xs text-muted font-medium mb-2">Slaytlar ({PPTX_SLIDES.length} adet):</p>
            {PPTX_SLIDES.map(slide => (
              <div key={slide.id} className="flex items-center gap-2 text-xs text-white">
                <span className="text-sm">{slide.icon}</span>
                <span className="text-muted">Slayt {slide.id}:</span>
                {slide.label}
              </div>
            ))}
          </div>

          <button
            onClick={handlePPTX}
            disabled={isExporting}
            className={clsx(
              'w-full btn text-sm font-semibold py-3 justify-center transition-all',
              pptxDone
                ? 'bg-info/20 text-info border border-info/30'
                : 'bg-info/20 text-info border border-info/30 hover:bg-info/30 disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isExporting && exportType === 'pptx' ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Slaytlar Hazırlanıyor...
              </>
            ) : pptxDone ? (
              <>
                <CheckCircle size={16} />
                İndirildi!
              </>
            ) : (
              <>
                <Download size={16} />
                PowerPoint İndir (.pptx)
              </>
            )}
          </button>

          <p className="text-[10px] text-muted mt-2 text-center">
            Dosya adı: Rekabet_Sunumu_{new Date().toISOString().split('T')[0]}.pptx
          </p>
        </div>
      </div>

      {/* Preview info */}
      <div className="card bg-surface2/50">
        <h3 className="text-sm font-semibold text-white mb-3">📋 Rapor İçeriği Önizlemesi</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Excel Sayfaları', value: totalSheets + 2, icon: '📄' },
            { label: 'PPTX Slaytlar', value: 8, icon: '🖥️' },
            { label: 'Marka Sayısı', value: 11, icon: '🏢' },
            { label: 'Veri Noktaları', value: '500+', icon: '📊' },
          ].map(item => (
            <div key={item.label} className="p-3 bg-surface rounded-lg">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-xl font-bold text-white">{item.value}</div>
              <div className="text-xs text-muted">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-navy-border">
          <p className="text-xs text-muted leading-relaxed">
            <strong className="text-white">Not:</strong> Raporlar otomatik olarak tarayıcınızdan indirilecektir.
            Excel dosyaları Microsoft Excel 2016+ ve Google Sheets ile uyumludur.
            PowerPoint dosyaları Microsoft PowerPoint 2016+ ve Google Slides ile uyumludur.
            Tüm veriler Mayıs 2026 dönemi için güncellenmiştir.
          </p>
        </div>
      </div>

      {/* Report history (localStorage) */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-3">💡 Kullanım Kılavuzu</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted">
          <div>
            <p className="text-white font-medium mb-1">Excel Raporu İçin:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Dahil edilecek bölümleri seçin</li>
              <li>"Excel İndir" butonuna tıklayın</li>
              <li>İndirilen .xlsx dosyasını açın</li>
              <li>Her sekme farklı bir bölüme karşılık gelir</li>
            </ol>
          </div>
          <div>
            <p className="text-white font-medium mb-1">PowerPoint İçin:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>"PowerPoint İndir" butonuna tıklayın</li>
              <li>Dosya otomatik hazırlanacak</li>
              <li>İndirilen .pptx dosyasını açın</li>
              <li>Hazır sunum formatında sunuma başlayın</li>
            </ol>
          </div>
          <div>
            <p className="text-white font-medium mb-1">Veri Güncelleme:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Dashboard her oturumda taze veri yükler</li>
              <li>Canlı ticker her 8 saniyede güncellenir</li>
              <li>Rapor tarihi otomatik olarak eklenir</li>
              <li>Geçmiş raporlar karşılaştırma için saklanır</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
