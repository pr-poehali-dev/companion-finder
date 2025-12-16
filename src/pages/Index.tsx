import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface TripData {
  id: string;
  fullName: string;
  trainNumber: string;
  departureDate: string;
  arrivalDate: string;
  carNumber: string;
  seatNumber: string;
  additionalInfo: string;
}

const Index = () => {
  const [view, setView] = useState<'home' | 'search' | 'cabinet'>('home');
  const [formData, setFormData] = useState<TripData>({
    id: '',
    fullName: '',
    trainNumber: '',
    departureDate: '',
    arrivalDate: '',
    carNumber: '',
    seatNumber: '',
    additionalInfo: ''
  });
  const [searchResults, setSearchResults] = useState<TripData[]>([]);
  const [myTrips, setMyTrips] = useState<TripData[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: keyof TripData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const newTrip: TripData = {
      ...formData,
      id: Date.now().toString()
    };

    const matches = myTrips.filter(trip => 
      trip.trainNumber === formData.trainNumber &&
      trip.departureDate === formData.departureDate &&
      trip.arrivalDate === formData.arrivalDate &&
      trip.carNumber === formData.carNumber &&
      trip.id !== newTrip.id
    );

    setSearchResults(matches);
    setShowResults(true);
    setMyTrips(prev => [...prev, newTrip]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
              <Icon name="Train" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">ПопутчикЪ</h1>
          </div>
          <nav className="flex gap-4">
            <Button 
              variant={view === 'home' ? 'default' : 'ghost'} 
              onClick={() => setView('home')}
              className="flex items-center gap-2"
            >
              <Icon name="Home" size={18} />
              Главная
            </Button>
            <Button 
              variant={view === 'cabinet' ? 'default' : 'ghost'} 
              onClick={() => setView('cabinet')}
              className="flex items-center gap-2"
            >
              <Icon name="User" size={18} />
              Мой кабинет
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {view === 'home' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-slate-800 mb-6">
                Узнайте своих попутчиков <br />до начала поездки
              </h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Познакомьтесь с людьми, с которыми вы поедете в одном вагоне. 
                Договоритесь о совместном времяпрепровождении и сделайте путешествие комфортнее!
              </p>
              <Button 
                size="lg" 
                onClick={() => setView('search')}
                className="text-lg px-8 py-6 bg-sky-500 hover:bg-sky-600 shadow-lg hover:shadow-xl transition-all"
              >
                <Icon name="Search" size={24} className="mr-2" />
                Узнать попутчика
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="p-6 text-center hover-scale">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={32} className="text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Найдите попутчиков</h3>
                <p className="text-slate-600">Узнайте, кто едет с вами в одном вагоне</p>
              </Card>

              <Card className="p-6 text-center hover-scale">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="MessageCircle" size={32} className="text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Познакомьтесь заранее</h3>
                <p className="text-slate-600">Представьтесь и узнайте о других пассажирах</p>
              </Card>

              <Card className="p-6 text-center hover-scale">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Coffee" size={32} className="text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Спланируйте поездку</h3>
                <p className="text-slate-600">Договоритесь о совместных делах в пути</p>
              </Card>
            </div>
          </div>
        )}

        {view === 'search' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Button 
              variant="ghost" 
              onClick={() => setView('home')}
              className="mb-6"
            >
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад
            </Button>

            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-slate-800">Поиск попутчиков</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">ФИО</Label>
                  <Input 
                    id="fullName"
                    placeholder="Иванов Иван Иванович"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trainNumber">Номер поезда</Label>
                    <Input 
                      id="trainNumber"
                      placeholder="123А"
                      value={formData.trainNumber}
                      onChange={(e) => handleInputChange('trainNumber', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="carNumber">Номер вагона</Label>
                    <Input 
                      id="carNumber"
                      placeholder="5"
                      value={formData.carNumber}
                      onChange={(e) => handleInputChange('carNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="departureDate">Дата отправления</Label>
                    <Input 
                      id="departureDate"
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => handleInputChange('departureDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="arrivalDate">Дата прибытия</Label>
                    <Input 
                      id="arrivalDate"
                      type="date"
                      value={formData.arrivalDate}
                      onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="seatNumber">Номер места</Label>
                  <Input 
                    id="seatNumber"
                    placeholder="12"
                    value={formData.seatNumber}
                    onChange={(e) => handleInputChange('seatNumber', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="additionalInfo">Дополнительная информация</Label>
                  <Textarea 
                    id="additionalInfo"
                    placeholder="Расскажите о себе, своих интересах или планах на поездку..."
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleSearch}
                  className="w-full bg-sky-500 hover:bg-sky-600"
                  size="lg"
                >
                  <Icon name="Search" size={20} className="mr-2" />
                  Найти попутчиков
                </Button>
              </div>

              {showResults && (
                <div className="mt-8 pt-8 border-t border-slate-200 animate-fade-in">
                  <h3 className="text-2xl font-semibold mb-4 text-slate-800">Результаты поиска</h3>
                  
                  {searchResults.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ФИО</TableHead>
                            <TableHead>Место</TableHead>
                            <TableHead>Дополнительная информация</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {searchResults.map((result) => (
                            <TableRow key={result.id}>
                              <TableCell className="font-medium">{result.fullName}</TableCell>
                              <TableCell>{result.seatNumber}</TableCell>
                              <TableCell>{result.additionalInfo || '—'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <Card className="p-6 bg-slate-50 border-slate-200">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Icon name="Info" size={24} className="text-slate-400" />
                        <p className="text-lg">Попутчики о себе не заявили</p>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {view === 'cabinet' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-slate-800">Личный кабинет</h2>

            <Tabs defaultValue="trips" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="trips" className="flex items-center gap-2">
                  <Icon name="Calendar" size={18} />
                  История поездок
                </TabsTrigger>
                <TabsTrigger value="contacts" className="flex items-center gap-2">
                  <Icon name="Users" size={18} />
                  Мои попутчики
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trips">
                <Card className="p-6">
                  {myTrips.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Поезд</TableHead>
                            <TableHead>Отправление</TableHead>
                            <TableHead>Прибытие</TableHead>
                            <TableHead>Вагон</TableHead>
                            <TableHead>Место</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {myTrips.map((trip) => (
                            <TableRow key={trip.id}>
                              <TableCell className="font-medium">{trip.trainNumber}</TableCell>
                              <TableCell>{new Date(trip.departureDate).toLocaleDateString('ru-RU')}</TableCell>
                              <TableCell>{new Date(trip.arrivalDate).toLocaleDateString('ru-RU')}</TableCell>
                              <TableCell>{trip.carNumber}</TableCell>
                              <TableCell>{trip.seatNumber}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="Calendar" size={48} className="mx-auto mb-4 text-slate-300" />
                      <p className="text-slate-500 text-lg">У вас пока нет поездок</p>
                      <Button 
                        onClick={() => setView('search')}
                        variant="outline"
                        className="mt-4"
                      >
                        Добавить поездку
                      </Button>
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="contacts">
                <Card className="p-6">
                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.map((contact) => (
                        <Card key={contact.id} className="p-4 hover-scale">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                              <Icon name="User" size={24} className="text-sky-500" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800">{contact.fullName}</h4>
                              <p className="text-sm text-slate-600">
                                Поезд {contact.trainNumber}, вагон {contact.carNumber}, место {contact.seatNumber}
                              </p>
                              {contact.additionalInfo && (
                                <p className="text-sm text-slate-500 mt-1">{contact.additionalInfo}</p>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="Users" size={48} className="mx-auto mb-4 text-slate-300" />
                      <p className="text-slate-500 text-lg">Вы еще не нашли попутчиков</p>
                      <Button 
                        onClick={() => setView('search')}
                        variant="outline"
                        className="mt-4"
                      >
                        Найти попутчиков
                      </Button>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-slate-600">
          <p>© 2024 ПопутчикЪ — Найди своих попутчиков в пути 🚂</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;