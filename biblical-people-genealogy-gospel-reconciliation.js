(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const get=id=>db.records.find(r=>r.id===id);
const addConn=(id,c)=>{const r=get(id);if(!r)return;r.connections=r.connections||[];if(!r.connections.some(x=>x.type===c.type&&x.target===c.target&&x.ref===c.ref))r.connections.push(c);};

// Replace Mark’s intentionally unnamed comparison target with useful named probable relationships.
const salome=get('salome-disciple');
if(salome){
 salome.connections=(salome.connections||[]).filter(c=>c.target!=='mother-zebedee-sons-unnamed');
 addConn('salome-disciple',C('probable mother of','james-zebedee','Matthew 27:56; Mark 15:40','Matthew’s parallel crucifixion list names the mother of Zebedee’s sons where Mark names Salome.'));
 addConn('salome-disciple',C('probable mother of','john-zebedee','Matthew 27:56; Mark 15:40','Matthew’s parallel crucifixion list names the mother of Zebedee’s sons where Mark names Salome.'));
 addConn('salome-disciple',C('probable spouse / household link','zebedee','Matthew 20:20; 27:56; Mark 15:40','If Salome is the mother of Zebedee’s sons, she belongs to Zebedee’s household; the Gospels do not explicitly call her Zebedee’s wife.'));
}

// Make probable Synoptic/Johannine apostolic name correspondences visible in both directions.
addConn('bartholomew',C('possible identity','nathanael','Matthew 10:3; Mark 3:18; Luke 6:14; John 1:45–51','Traditional identification is plausible from apostolic-list patterns and Philip’s association, but no Gospel states it directly.'));
addConn('thaddaeus',C('probable identity','judas-james-apostle','Matthew 10:3; Mark 3:18; Luke 6:16','Synoptic list position strongly suggests Thaddaeus and Judas of James are the same apostle, but the texts do not explicitly equate the names.'));
addConn('judas-james-apostle',C('probable identity','thaddaeus','Matthew 10:3; Mark 3:18; Luke 6:16','Synoptic list position strongly suggests the traditional identification.'));

// Cleopas/Clopas remains a possible, not forced, identity.
addConn('cleopas',C('possible identity','clopas-john19','Luke 24:18; John 19:25','The names are similar and may represent the same person, but the New Testament never explicitly says so.'));
addConn('clopas-john19',C('possible identity','cleopas','John 19:25; Luke 24:18','The names are similar and may represent the same person, but the New Testament never explicitly says so.'));

// Mark Matthew and Luke as fully completed Gospel audits; John’s module already closes the four-Gospel phase.
db.scope='Genesis–John';db.phase=11;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Matthew','Mark','Luke','John'])];
})();