export default function SiteFooter() {
  return (
    <footer className="bg-brand-dark text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Компания</h3>
            <p className="text-gray-400">ООО «Ремэлемент»</p>
            <p className="text-gray-400">ИНН: 5473025681</p>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Режим работы</h3>
            <p className="text-gray-400">Ежедневно: 9:00 – 17:00</p>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Контакты</h3>
            <p className="text-gray-400">г. Новосибирск, ул. Софийская, 12/2</p>
            <a href="tel:+79513860392" className="text-accent hover:text-white transition-colors">
              +7 951 386-03-92
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Ремэлемент. Все права защищены.
        </div>
      </div>
    </footer>
  );
}