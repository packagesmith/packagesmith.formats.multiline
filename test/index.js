import chai from 'chai';
import chaiSpies from 'chai-spies';
chai.use(chaiSpies).should();
import multiLineFile from '../src/';
describe('multiLineFile', () => {

  it('returns a function', () => {
    multiLineFile().should.be.a('function');
  });

  describe('output function', () => {
    let process = null;
    let subFunction = null;
    beforeEach(() => {
      process = chai.spy((contents) => contents);
      subFunction = multiLineFile(process);
    });

    it('calls the given function when called', () => {
      subFunction('abc');
      process.should.have.been.called(1);
    });

    it('calls the given function with the given contents, split by line', () => {
      subFunction('a\r\nb\nc');
      process.should.have.been.called.with.exactly([ 'a', 'b', 'c' ]);
    });

    it('calls the given function with the remaining args verbatum', () => {
      subFunction('a', 1, 2, 3);
      process.should.have.been.called.with.exactly([ 'a' ], 1, 2, 3);
    });

    it('returns new contents joined by `\\n`', () => {
      process = chai.spy((contents) => contents);
      subFunction('a\nb\r\nc')
        .should.equal('a\nb\nc\n');
    });

    it('returns the contents of the process function', () => {
      process = chai.spy(() => [ 'x', 'y', 'z' ]);
      subFunction = multiLineFile(process);
      subFunction('a\nb\nc')
        .should.equal('x\ny\nz\n');
    });

    it('returns unique lines by default', () => {
      process = chai.spy(() => [ 'x', 'z', 'x' ]);
      subFunction = multiLineFile(process);
      subFunction('a\nb\nc')
        .should.equal('x\nz\n');
    });

    it('can return non-unique contents with unique: false option', () => {
      process = chai.spy(() => [ 'x', 'x', 'z' ]);
      subFunction = multiLineFile(process, { unique: false });
      subFunction('a\nb\nc')
        .should.equal('x\nx\nz\n');
    });

    it('can return contents joined by an arbitrary character', () => {
      subFunction = multiLineFile(process, { newLine: '\r\n' });
      subFunction('a\nb\nc')
        .should.equal('a\r\nb\r\nc\r\n');
    });

    it('omits empty lines', () => {
      process = chai.spy((lines) => lines.concat([ 'x', 'y', 'z' ]));
      subFunction = multiLineFile(process);
      subFunction('\na\n')
        .should.equal('a\nx\ny\nz\n');
    });

    it('keeps empty lines if `omitEmptyLines: false`', () => {
      process = chai.spy((lines) => lines.concat([ 'x', 'y', 'z' ]));
      subFunction = multiLineFile(process, { omitEmptyLines: false });
      subFunction('\na\n')
        .should.equal('\na\nx\ny\nz\n');
    });

    it('does not append newline if { insertFinalNewline: false }', () => {
      subFunction = multiLineFile(process, { insertFinalNewline: false });
      subFunction('a').should.equal('a');
    });

  });

});
