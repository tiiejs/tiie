import Api from 'Api/Api';

const api = new Api('http://127.0.0.1:3000');

export default function(body) {
    describe('Api', function() {
        it('Get user Maxwell Chavez', function (done) {
            api.request((request) => {
                request.urn("/users/5b2d007edb7bb43108c66ca2");

            }).promise().then((response) => {
                let data = response.data();

                expect(data._id).to.be.eql("5b2d007edb7bb43108c66ca2");
                expect(data.index).to.be.eql(0);
                expect(data.guid).to.be.eql("860ae488-19b5-4256-bc96-f66b5d087a94");
                expect(data.isActive).to.be.eql(false);
                expect(data.balance).to.be.eql("$1,582.99");
                expect(data.picture).to.be.eql("http://placehold.it/32x32");
                expect(data.age).to.be.eql(27);
                expect(data.eyeColor).to.be.eql("blue");
                expect(data.name).to.be.eql("Maxwell Chavez");
                expect(data.gender).to.be.eql("male");
                expect(data.company).to.be.eql("GEEKFARM");
                expect(data.email).to.be.eql("maxwellchavez@geekfarm.com");
                expect(data.phone).to.be.eql("+1 (833) 445-3228");
                expect(data.address).to.be.eql("425 Murdock Court, Brethren, Mississippi, 8584");
                expect(data.about).to.be.eql("Sunt consequat consequat dolor cupidatat. Aliqua consectetur magna consequat aliquip tempor officia velit ea. Laborum duis dolore proident amet. Cillum non dolore est deserunt id tempor non fugiat sunt.\r\n");
                expect(data.registered).to.be.eql("2015-03-01T08:08:02 -01:00");
                expect(data.latitude).to.be.eql(-23.483986);
                expect(data.longitude).to.be.eql(-23.103694);
                expect(data.tags).to.be.eql([ "ut", "ullamco", "excepteur", "nulla", "do", "magna", "in" ]);
                expect(data.friends).to.be.eql([ { "id": 0, "name": "Yang Shields" }, { "id": 1, "name": "Santos Lawrence" }, { "id": 2, "name": "Chavez Nicholson" } ]);
                expect(data.greeting).to.be.eql("Hello, Maxwell Chavez! You have 6 unread messages.");
                expect(data.favoriteFruit).to.be.eql("strawberry");

                done();
            }).catch((error) => {
                done(error);
            });
        });
    });
};
